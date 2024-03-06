
export interface PresetParams {
	ccd: boolean
}

export abstract class Preset {
	abstract dispose(): void
}

