import {
  EntryPoint,
  TeamEntryPoints,
} from '../../../common/models/game-map.model';
import { create3DVector } from '../../../common/utils/vector.utils';

export function getEntryPointBottomRight(): EntryPoint {
  return {
    position: create3DVector(40, 0, -40),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, -85),
  };
}

export function getEntryPointMidBottomRight(): EntryPoint {
  return {
    position: create3DVector(25, 0, -40),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, -85),
  };
}

export function getEntryPointBottomLeft(): EntryPoint {
  return {
    position: create3DVector(-40, 0, -40),
    rotation: Math.PI,
    cameraPosition: create3DVector(0, 70, -85),
  };
}

export function getEntryPointMidBottomLeft(): EntryPoint {
  return {
    position: create3DVector(-25, 0, -40),
    rotation: Math.PI,
    cameraPosition: create3DVector(0, 70, -85),
  };
}

export function getEntryPointTopLeft(): EntryPoint {
  return {
    position: create3DVector(-40, 0, 40),
    rotation: Math.PI,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointMidTopLeft(): EntryPoint {
  return {
    position: create3DVector(-25, 0, 40),
    rotation: Math.PI,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointTopRight(): EntryPoint {
  return {
    position: create3DVector(40, 0, 40),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointMidTopRight(): EntryPoint {
  return {
    position: create3DVector(25, 0, 40),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointCenterUpperLeft(): EntryPoint {
  return {
    position: create3DVector(-40, 0, 9),
    rotation: Math.PI / 2,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointCenterLowerLeft(): EntryPoint {
  return {
    position: create3DVector(-40, 0, -9),
    rotation: Math.PI / 2,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointCenterUpperRight(): EntryPoint {
  return {
    position: create3DVector(40, 0, 9),
    rotation: Math.PI / 2,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointCenterLowerRight(): EntryPoint {
  return {
    position: create3DVector(40, 0, -9),
    rotation: Math.PI / 2,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

// Centered Entry Points

export function getEntryPointCenterBottomRight(): EntryPoint {
  return {
    position: create3DVector(15, 0, -15),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, -85),
  };
}

export function getEntryPointCenterBottomLeft(): EntryPoint {
  return {
    position: create3DVector(-15, 0, -15),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, -85),
  };
}

export function getEntryPointCenterTopRight(): EntryPoint {
  return {
    position: create3DVector(15, 0, 15),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getEntryPointCenterTopLeft(): EntryPoint {
  return {
    position: create3DVector(-15, 0, 15),
    rotation: 2 * Math.PI,
    cameraPosition: create3DVector(0, 70, 85),
  };
}

export function getCornerTeamEntryPoints(): TeamEntryPoints[] {
  return [
    {
      team: 1,
      point: [getEntryPointBottomRight(), getEntryPointMidBottomRight()],
    },
    {
      team: 2,
      point: [getEntryPointTopLeft(), getEntryPointMidTopLeft()],
    },
    {
      team: 3,
      point: [getEntryPointBottomLeft(), getEntryPointMidBottomLeft()],
    },
    {
      team: 4,
      point: [getEntryPointTopRight(), getEntryPointMidTopRight()],
    },
    {
      team: 5,
      point: [getEntryPointCenterUpperLeft(), getEntryPointCenterLowerLeft()],
    },
    {
      team: 6,
      point: [getEntryPointCenterUpperRight(), getEntryPointCenterLowerRight()],
    },
  ];
}

export function getCornerBotTeamEntryPoints(): TeamEntryPoints[] {
  return [
    {
      team: 1,
      point: [
        getEntryPointBottomRight(),
        getEntryPointBottomLeft(),
        getEntryPointMidBottomRight(),
        getEntryPointMidBottomLeft(),
      ],
    },
    {
      team: 2,
      point: [
        getEntryPointTopLeft(),
        getEntryPointTopRight(),
        getEntryPointCenterUpperLeft(),
        getEntryPointCenterUpperRight(),
        getEntryPointMidTopRight(),
        getEntryPointMidTopLeft(),
        getEntryPointCenterLowerRight(),
        getEntryPointCenterLowerLeft(),
      ],
    },
  ];
}

export function getCenterTeamEntryPoints(): TeamEntryPoints[] {
  return [
    {
      team: 1,
      point: [getEntryPointCenterTopLeft(), getEntryPointMidTopLeft()],
    },
    {
      team: 2,
      point: [getEntryPointCenterBottomRight(), getEntryPointMidBottomRight()],
    },
    {
      team: 3,
      point: [getEntryPointCenterTopRight(), getEntryPointMidTopRight()],
    },
    {
      team: 4,
      point: [getEntryPointCenterBottomLeft(), getEntryPointMidBottomLeft()],
    },
  ];
}

export function getCenterBotTeamEntryPoints(): TeamEntryPoints[] {
  return [
    {
      team: 1,
      point: [
        getEntryPointCenterBottomLeft(),
        getEntryPointCenterBottomRight(),
      ],
    },
    {
      team: 3,
      point: [
        getEntryPointCenterTopRight(),
        getEntryPointCenterTopLeft(),
        getEntryPointMidTopRight(),
        getEntryPointMidTopLeft(),
      ],
    },
  ];
}
