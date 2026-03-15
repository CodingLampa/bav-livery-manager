import path from 'node:path';
import fs from 'fs-extra';
import { app } from 'electron';
import type { DetectedSimPaths } from '../types';

const USER_CFG_FILE = 'UserCfg.opt';
const COMMUNITY_FOLDER = 'Community';

type ElectronPathKey = 'appData' | 'localAppData';

const PATH_ENV_FALLBACKS: Partial<Record<ElectronPathKey, string[]>> = {
    appData: ['APPDATA'],
    localAppData: ['LOCALAPPDATA']
};

const missingPathWarnings = new Set<ElectronPathKey>();

function safeGetPath(key: ElectronPathKey): string | null {
    if (process.platform !== 'win32') return null;

    if (key === 'localAppData') {
        const envKeys = PATH_ENV_FALLBACKS[key] || [];
        for (const envKey of envKeys) {
            const envPath = process.env[envKey];
            if (envPath) return envPath;
        }

        if (!missingPathWarnings.has(key)) {
            missingPathWarnings.add(key);
            console.warn(`Unable to resolve environment path for ${key}`);
        }

        return null;
    }

    try {
        return app.getPath(key);
    } catch {
        const envKeys = PATH_ENV_FALLBACKS[key] || [];
        for (const envKey of envKeys) {
            const envPath = process.env[envKey];
            if (envPath) return envPath;
        }

        if (!missingPathWarnings.has(key)) {
            missingPathWarnings.add(key);
            console.warn(`Unable to resolve Electron path for ${key}`);
        }

        return null;
    }
}

const USER_CFG_LOCATIONS = {
    MSFS2020: () => {
        const locations: string[] = [];
        const appData = safeGetPath('appData');
        const localAppData = safeGetPath('localAppData');

        if (appData) {
            locations.push(path.join(appData, 'Microsoft Flight Simulator', USER_CFG_FILE));
        }

        if (localAppData) {
            locations.push(
                path.join(
                    localAppData,
                    'Packages',
                    'Microsoft.FlightSimulator_8wekyb3d8bbwe',
                    'LocalCache',
                    USER_CFG_FILE
                )
            );
        }

        return locations;
    },

    MSFS2024: () => {
        const locations: string[] = [];
        const appData = safeGetPath('appData');
        const localAppData = safeGetPath('localAppData');

        if (appData) {
            locations.push(path.join(appData, 'Microsoft Flight Simulator 2024', USER_CFG_FILE));
        }

        if (localAppData) {
            locations.push(
                path.join(
                    localAppData,
                    'Packages',
                    'Microsoft.Limitless_8wekyb3d8bbwe',
                    'LocalCache',
                    USER_CFG_FILE
                )
            );
        }

        return locations;
    }
};

async function resolveCommunityFolder(candidatePaths: string[]): Promise<string | null> {
    for (const cfgPath of candidatePaths) {
        try {
            if (!(await fs.pathExists(cfgPath))) continue;

            const contents = await fs.readFile(cfgPath, 'utf8');
            const match = contents.match(/InstalledPackagesPath\s+"([^"]+)"/i);

            if (match && match[1]) {
                const packagesPath = path.normalize(match[1].trim());
                const communityPath = path.join(packagesPath, COMMUNITY_FOLDER);

                if (await fs.pathExists(communityPath)) return communityPath;

                return packagesPath;
            }
        } catch {
            continue;
        }
    }

    return null;
}

async function resolveFirstExisting(paths: string[]): Promise<string | null> {
    for (const p of paths) {
        if (await fs.pathExists(p)) return p;
    }
    return null;
}

function wasmLocations2020(): string[] {
    const appData = safeGetPath('appData');
    const localAppData = safeGetPath('localAppData');

    const paths: string[] = [];

    if (localAppData) {
        paths.push(
            path.join(
                localAppData,
                'Packages',
                'Microsoft.FlightSimulator_8wekyb3d8bbwe',
                'LocalState',
                'Packages'
            )
        );
    }

    if (appData) {
        paths.push(
            path.join(
                appData,
                'Microsoft Flight Simulator',
                'Packages'
            )
        );
    }

    return paths;
}

function wasmLocations2024(): string[] {
    const appData = safeGetPath('appData');
    const localAppData = safeGetPath('localAppData');

    const paths: string[] = [];

    if (localAppData) {
        paths.push(
            path.join(
                localAppData,
                'Packages',
                'Microsoft.Limitless_8wekyb3d8bbwe',
                'LocalState',
                'WASM',
                'MSFS2024'
            )
        );
    }

    if (appData) {
        paths.push(
            path.join(
                appData,
                'Microsoft Flight Simulator 2024',
                'WASM',
                'MSFS2024'
            )
        );
    }

    return paths;
}

export async function detectSimulatorPaths(): Promise<DetectedSimPaths> {
    if (process.platform !== 'win32') {
        return {
            msfs2020Path: null,
            msfs2024Path: null,
            msfs2020WasmPath: null,
            msfs2024WasmPath: null
        };
    }

    if (!app.isReady()) {
        await app.whenReady();
    }

    const [msfs2020Path, msfs2024Path, msfs2020WasmPath, msfs2024WasmPath] =
        await Promise.all([
            resolveCommunityFolder(USER_CFG_LOCATIONS.MSFS2020()),
            resolveCommunityFolder(USER_CFG_LOCATIONS.MSFS2024()),
            resolveFirstExisting(wasmLocations2020()),
            resolveFirstExisting(wasmLocations2024())
        ]);

    return {
        msfs2020Path,
        msfs2024Path,
        msfs2020WasmPath,
        msfs2024WasmPath
    };
}