// Enum fields are numbers: the backend serializes C# enums by value.

export interface Variant {
    id: string,
    objectKeyInStorage: string,
    cpuPlatform: number,
    screenDensity: number | null,
    minOsVersion: string | null,
    language: string | null,
    fileSizeBytes: number
}

export interface Release {
    id: string,
    applicationId: string,
    platform: number,
    versionId: string,
    releaseNotes: string,
    createdAt: string,
    variants: Variant[]
}

/** Mirrors the backend's ApplicationDao. */
export interface Application {
    applicationId: string,
    name: string,
    description: string,
    storeIcon: string | null,
    elevatorPitch: string,
    photoUrls: string[],
    supportedPlatforms: number[],
    releases: Release[]
}

/** Mirrors the backend's ApplicationInput. */
export interface ApplicationInput {
    applicationName: string,
    shortDescription: string,
    applicationDescription: string,
    categoryId: number
}
