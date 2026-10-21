// Pure function: given threat data, nearest cluster distance, and last-6h PM2.5 trend,
// return a hint string or null if no smoke attribution can be made.

export interface SmokeHintInput {
  /** Threat entry for the current city (from HotspotPayload.threat), or undefined */
  cityThreat: { clusters: number; earliestEtaHours: number | null } | undefined;
  /** Distance (km) to nearest hotspot cluster */
  nearestClusterKm: number | null;
  /** PM2.5 values for the last 6 hours (null = missing) */
  pm25Last6h: (number | null)[];
}

export interface SmokeHintResult {
  show: boolean;
  message: string;
}

/** Returns whether smoke attribution is plausible and a short Indonesian message. */
export function smokeHint(input: SmokeHintInput): SmokeHintResult {
  const { cityThreat, nearestClusterKm, pm25Last6h } = input;

  // No threat data and cluster far away → no hint
  if (!cityThreat && (nearestClusterKm == null || nearestClusterKm > 200)) {
    return { show: false, message: "" };
  }

  // Check if PM2.5 is rising (last 3h vs first 3h of the 6h window)
  const valid = pm25Last6h.filter((v): v is number => v != null);
  const rising =
    valid.length >= 4 &&
    valid.slice(-3).reduce((a, b) => a + b, 0) / 3 >
      valid.slice(0, 3).reduce((a, b) => a + b, 0) / 3;

  if (
    cityThreat &&
    cityThreat.earliestEtaHours != null &&
    cityThreat.earliestEtaHours <= 6
  ) {
    return {
      show: true,
      message: `${cityThreat.clusters} klaster titik api mengarah ke kota ini, perkiraan asap tiba dalam ${cityThreat.earliestEtaHours} jam.`,
    };
  }

  if (nearestClusterKm != null && nearestClusterKm < 100 && rising) {
    return {
      show: true,
      message: `Titik api terdekat ${Math.round(nearestClusterKm)} km dari kota ini. PM2.5 cenderung meningkat dalam 6 jam terakhir.`,
    };
  }

  if (cityThreat && cityThreat.clusters > 0) {
    return {
      show: true,
      message: `${cityThreat.clusters} klaster titik api terdeteksi berpotensi memengaruhi kota ini.`,
    };
  }

  return { show: false, message: "" };
}
