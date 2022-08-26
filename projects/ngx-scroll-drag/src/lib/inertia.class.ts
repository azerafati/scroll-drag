import { ScrollDragDirective } from "./scroll-drag.directive";

const INERTIAL_MOVE_DIVIDER = 15;

export interface Coords {
  x: number;
  y: number;
}

export class Inertia {
  private impulseY = 0;
  private totalImpulseEnergy = 0;
  private inertialMoveDivider = INERTIAL_MOVE_DIVIDER;
  private mouseWayPoints: Coords[] = [];
  private readonly maxPointsToCheckSpeed = 3;

  constructor(private scrollDragDirective: ScrollDragDirective) {
  }

  public addMouseWayPoints(x: number, y: number): Inertia {
    if (this.mouseWayPoints.push({x, y}) > this.maxPointsToCheckSpeed) {
      this.mouseWayPoints.shift();
    }

    return this;
  }


  public stopInertion(): Inertia {
    this.totalImpulseEnergy = 0;
    return this;
  }

  public startInertialMove(x: number, y: number): void {
    const totalDist = this.mouseWayPoints.reduce(function (prev, curr) {
      prev += curr.y;
      return prev;
    }, 0);

    this.impulseY = totalDist / this.mouseWayPoints.length - y;

    this.totalImpulseEnergy = Math.abs(this.impulseY);

    this.clearWayPoints();
    if (this.totalImpulseEnergy > 10) {
      this.inertialDisplacement();
    }
  }

  private clearWayPoints(): Inertia {
    this.mouseWayPoints.length = 0;
    return this;
  }

  private inertialDisplacement(): void {

    if (this.totalImpulseEnergy <= 0) {
      this.inertialMoveDivider = INERTIAL_MOVE_DIVIDER;
      return;
    }

    const scrollOffset = this.impulseY;

    this.scrollDragDirective.scroll(scrollOffset);

    setTimeout(() => {
      this.totalImpulseEnergy -= Math.abs(scrollOffset / this.inertialMoveDivider);
      this.inertialDisplacement();
    }, 1000 / 60);
  }
}
