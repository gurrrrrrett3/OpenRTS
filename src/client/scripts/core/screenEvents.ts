import { MouseButtonStatus } from "../../types";
import CLogger from "../utils/logger";
import DragManager from "./controls/dragManager";

export interface ScreenEvents {
  // load data
  load: void;
  unload: void;

  // mouse events

  click: {
    x: number;
    y: number;
    clickStatus: MouseButtonStatus;
  };
  release: {
    x: number;
    y: number;
  };

  // drag events

  startDrag: {
    x: number;
    y: number;
    clickStatus: MouseButtonStatus;
  };
  dragFrame: {
    start: {
      x: number;
      y: number;
    };
    end: {
      x: number;
      y: number;
    };
  };
  endDrag: {
    start: {
      x: number;
      y: number;
    };
    end: {
      x: number;
      y: number;
    };
    clickStatus: MouseButtonStatus;
    distance: number;
  };

  // screen events

  update: void;
  draw: void;
  resize: {
    width: number;
    height: number;
  };

  // other events
  assetsLoaded: void;
}

export type ScreenEvent = keyof ScreenEvents;
export type ScreenEventCallback<T extends ScreenEvent> = (event: ScreenEvents[T]) => void;

export default class ScreenEventManager {
  private static _screenEventManager: ScreenEventManager;

  private static eventNames: ScreenEvent[] = [
    "load",
    "unload",
    "click",
    "release",
    "startDrag",
    "dragFrame",
    "endDrag",
    "update",
    "draw",
    "resize",
    "assetsLoaded",
  ];

  public static get instance(): ScreenEventManager {
    if (!this._screenEventManager) {
      this._screenEventManager = new ScreenEventManager();
    }
    return this._screenEventManager;
  }

  private _events: {
    [key in ScreenEvent]: {
      callback: ScreenEventCallback<key>;
      priority: number;
    }[];
  };

  private constructor() {
    this._events = {} as any;

    ScreenEventManager.eventNames.forEach((eventName) => {
      this._events[eventName] = [];
    });
  }

  public on<T extends ScreenEvent>(event: T, callback: ScreenEventCallback<T>, priority?: number): void {
    this._events[event].push({
      callback,
      priority: priority || 0,
    });

    this._sortEvents(event);

    CLogger.debug(
      "ScreenEventManager",
      `registered callback for event ${event} | ${this._events[event].length} callbacks`
    );
  }

  public once<T extends ScreenEvent>(event: T, callback: ScreenEventCallback<T>, priority?: number): void {
    const onceCallback = (data: ScreenEvents[T]) => {
      callback(data);
      this.off(event, onceCallback);
    };

    this.on(event, onceCallback, priority);
  }

  public off<T extends ScreenEvent>(event: T, callback: ScreenEventCallback<T>): void {
    // @ts-ignore
    this._events[event] = this._events[event].filter((cb) => cb !== callback);
  }

  public emit<T extends ScreenEvent>(event: T): void;
  public emit<T extends ScreenEvent>(event: T, data: ScreenEvents[T]): void;
  public emit<T extends ScreenEvent>(event: T, data?: ScreenEvents[T]): void {
    this._events[event].forEach((callback) => {
      if (data) {
        callback.callback(data);
      } else {
        callback.callback({} as any);
      }
    });
  }

  public clear(): void {
    ScreenEventManager.eventNames.forEach((eventName) => {
      this._events[eventName] = [];
    });
  }

  public get events(): {
    [key in ScreenEvent]: {
      callback: ScreenEventCallback<key>;
      priority: number;
    }[];
  } {
    return this._events;
  }

  public set events(events: {
    [key in ScreenEvent]: {
      callback: ScreenEventCallback<key>;
      priority: number;
    }[];
  }) {
    this._events = events;
  }

  private _sortEvents(key: ScreenEvent): void {
    this._events[key].sort((a, b) => a.priority - b.priority);
  }
}
