import { CpuArchitecture, Variant } from './application';
import { formatBytes, platformBySlug, variantForSlot } from './release-platforms';

function variant(cpuArchitectures: CpuArchitecture[], extra: Partial<Variant> = {}): Variant {
  return {
    id: cpuArchitectures.join('-'),
    objectKeyInStorage: '',
    cpuArchitectures,
    screenDensity: null,
    minOsVersion: null,
    language: null,
    fileSizeBytes: 1,
    fileName: 'f',
    sha256: null,
    uploadedAt: '',
    ...extra,
  };
}

describe('release platforms', () => {
  const mac = platformBySlug('mac')!;
  const universal2 = mac.slots.find((s) => s.label === 'Universal')!;
  const appleSilicon = mac.slots.find((s) => s.label === 'Apple Silicon')!;

  it('offers PowerPC and 68k slots for Mac', () => {
    const cpus = mac.slots.flatMap((s) => s.cpuArchitectures);
    expect(cpus).toContain(CpuArchitecture.PowerPC);
    expect(cpus).toContain(CpuArchitecture.M68k);
  });

  it('matches a fat binary to its slot whatever the CPU order', () => {
    const fat = variant([CpuArchitecture.Arm64, CpuArchitecture.X64]);
    expect(variantForSlot(universal2, [fat])).toBe(fat);
    expect(variantForSlot(appleSilicon, [fat])).toBeUndefined();
  });

  it('leaves density- or language-specific binaries out of the slots', () => {
    const french = variant([CpuArchitecture.Arm64], { language: 'fr' });
    expect(variantForSlot(appleSilicon, [french])).toBeUndefined();
  });

  it('formats file sizes', () => {
    expect(formatBytes(512)).toBe('512 bytes');
    expect(formatBytes(41943040)).toBe('40.0 MB');
  });
});
