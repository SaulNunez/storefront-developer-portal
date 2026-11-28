import { CpuArchitecture, TargetPlatform, Variant } from './application';

/** One upload slot on a release page: a binary built for exactly these CPUs. */
export interface BinarySlot {
  label: string;
  hint?: string;
  cpuArchitectures: CpuArchitecture[];
}

export interface PlatformConfig {
  /** Used in the portal's URLs: /application/:id/release/:slug */
  slug: PlatformSlug;
  name: string;
  platform: TargetPlatform;
  /** File types the backend accepts for this platform, for the file picker. */
  accept: string;
  slots: BinarySlot[];
}

export type PlatformSlug = 'windows' | 'mac' | 'android';

/** Matches ReleaseService.MaxBinaryBytes on the backend. */
export const maxBinaryBytes = 2 * 1024 * 1024 * 1024;

const { Universal, X86, X64, Arm64, Arm32, PowerPC, M68k } = CpuArchitecture;

export const platforms: readonly PlatformConfig[] = [
  {
    slug: 'windows',
    name: 'Windows',
    platform: TargetPlatform.Windows,
    accept: '.exe,.msi,.msix,.msixbundle,.appx,.appxbundle,.zip',
    slots: [
      { label: 'x64', hint: 'Intel and AMD 64-bit', cpuArchitectures: [X64] },
      { label: 'ARM64', cpuArchitectures: [Arm64] },
      { label: 'x86', hint: '32-bit Intel and AMD', cpuArchitectures: [X86] },
      { label: 'ARM 32-bit', cpuArchitectures: [Arm32] },
      { label: 'Any CPU', hint: 'One build that runs everywhere, e.g. .NET AnyCPU', cpuArchitectures: [Universal] },
    ],
  },
  {
    slug: 'mac',
    name: 'Mac',
    platform: TargetPlatform.MacOs,
    accept: '.dmg,.pkg,.zip,.sit,.sea,.hqx,.bin,.img,.smi,.dsk',
    slots: [
      { label: 'Universal', hint: 'Apple Silicon and Intel in one binary', cpuArchitectures: [X64, Arm64] },
      { label: 'Apple Silicon', cpuArchitectures: [Arm64] },
      { label: 'Intel', cpuArchitectures: [X64] },
      { label: 'Universal (PowerPC/Intel)', hint: 'PowerPC and 32-bit Intel in one binary', cpuArchitectures: [PowerPC, X86] },
      { label: 'PowerPC', cpuArchitectures: [PowerPC] },
      { label: 'Motorola 68k', cpuArchitectures: [M68k] },
    ],
  },
  {
    slug: 'android',
    name: 'Android',
    platform: TargetPlatform.Android,
    accept: '.apk',
    slots: [
      { label: 'Universal APK', hint: 'One APK for every device', cpuArchitectures: [Universal] },
      { label: 'arm64-v8a', cpuArchitectures: [Arm64] },
      { label: 'armeabi-v7a', cpuArchitectures: [Arm32] },
      { label: 'x86_64', cpuArchitectures: [X64] },
      { label: 'x86', cpuArchitectures: [X86] },
    ],
  },
];

export function platformBySlug(slug: string | null | undefined): PlatformConfig | undefined {
  return platforms.find((p) => p.slug === slug);
}

export function platformByValue(platform: TargetPlatform): PlatformConfig | undefined {
  return platforms.find((p) => p.platform === platform);
}

/** The uploaded binary in this slot: same CPUs in any order, with no screen-density or language variant. */
export function variantForSlot(slot: BinarySlot, variants: readonly Variant[]): Variant | undefined {
  const wanted = new Set(slot.cpuArchitectures);
  return variants.find(
    (v) =>
      v.screenDensity === null &&
      v.language === null &&
      v.cpuArchitectures.length === wanted.size &&
      v.cpuArchitectures.every((cpu) => wanted.has(cpu)),
  );
}

export function formatBytes(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return unit === 0 ? `${value} ${units[0]}` : `${value.toFixed(1)} ${units[unit]}`;
}
