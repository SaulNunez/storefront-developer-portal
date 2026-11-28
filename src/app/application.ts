// Enum fields are numbers: the backend serializes C# enums by value.

/** Mirrors the backend's TargetPlatform. */
export const TargetPlatform = { Windows: 0, Android: 1, MacOs: 2, Linux: 3 } as const;
export type TargetPlatform = (typeof TargetPlatform)[keyof typeof TargetPlatform];

/** Mirrors the backend's CpuArchitecture. Universal means architecture-independent. */
export const CpuArchitecture = {
    Universal: 0,
    X86: 1,
    X64: 2,
    Arm64: 3,
    Arm32: 4,
    PowerPC: 5,
    M68k: 6,
} as const;
export type CpuArchitecture = (typeof CpuArchitecture)[keyof typeof CpuArchitecture];

/** One uploaded binary. Mirrors the backend's VariantDao. */
export interface Variant {
    id: string,
    objectKeyInStorage: string,
    /** Every CPU the binary runs on; a fat binary lists several. */
    cpuArchitectures: CpuArchitecture[],
    screenDensity: number | null,
    minOsVersion: string | null,
    language: string | null,
    fileSizeBytes: number,
    fileName: string,
    sha256: string | null,
    uploadedAt: string
}

/** Mirrors the backend's ReleaseDao. */
export interface Release {
    id: string,
    applicationId: string,
    platform: TargetPlatform,
    versionId: string,
    releaseNotes: string,
    createdAt: string,
    variants: Variant[]
}

/** Mirrors the backend's ReleaseInput. */
export interface ReleaseInput {
    platform: TargetPlatform,
    versionId: string,
    releaseNotes: string
}

/** Mirrors the backend's ApplicationDao. */
export interface Application {
    applicationId: string,
    name: string,
    description: string,
    storeIcon: string | null,
    elevatorPitch: string,
    photoUrls: string[],
    supportedPlatforms: TargetPlatform[],
    releases: Release[]
}

/** Mirrors the backend's ApplicationInput. */
export interface ApplicationInput {
    applicationName: string,
    shortDescription: string,
    applicationDescription: string,
    categoryId: number
}
