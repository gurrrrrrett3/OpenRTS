import { MouseButtonStatus } from "../../types";
import CLogger from "../utils/logger";

export interface Events {
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
  scroll: {
    dx: number;
    dy: number;
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
    delta: {
      x: number;
      y: number;
    }
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

export type ScreenEvent = keyof Events;
export type ScreenEventCallback<T extends ScreenEvent> = (event: Events[T]) => void;

/**
 * EventManager
 * Manages game Events
 */
export default class EventManager {
  private static _EventManager: EventManager;

  private static eventNames: ScreenEvent[] = [
    "load",
    "unload",
    "click",
    "release",
    "scroll",
    "startDrag",
    "dragFrame",
    "endDrag",
    "update",
    "draw",
    "resize",
    "assetsLoaded",
  ];

  public static get instance(): EventManager {
    if (!this._EventManager) {
      this._EventManager = new EventManager();
    }
    return this._EventManager;
  }

  private _events: {
    [key in ScreenEvent]: {
      callback: ScreenEventCallback<key>;
      priority: number;
    }[];
  };

  private constructor() {
    this._events = {} as any;

    EventManager.eventNames.forEach((eventName) => {
      this._events[eventName] = [];
    });
  }

  /**
   * Register a callback for a screen event
   * @param event Event name
   * @param callback Callback function
   * @param priority Priority of the callback. Higher priority callbacks are called first.
   */
  public on<T extends ScreenEvent>(event: T, callback: ScreenEventCallback<T>, priority?: number): void {
    this._events[event].push({
      callback,
      priority: priority || 0,
    });

    this._sortEvents(event);

    CLogger.debug(
      "EventManager",
      `registered callback for event ${event} | ${this._events[event].length} callbacks`
    );
  }

  /**
   * Register a callback for a screen event that is only called once
   * @param event Event name
   * @param callback Callback function
   * @param priority Priority of the callback. Higher priority callbacks are called first.
   */
  public once<T extends ScreenEvent>(event: T, callback: ScreenEventCallback<T>, priority?: number): void {
    const onceCallback = (data: Events[T]) => {
      callback(data);
      this.off(event, onceCallback);
    };

    this.on(event, onceCallback, priority);
  }

  /**
   * Remove a callback for a screen event
   * @param event Event name
   * @param callback Callback function to remove
   */
  public off<T extends ScreenEvent>(event: T, callback: ScreenEventCallback<T>): void {
    // @ts-ignore
    this._events[event] = this._events[event].filter((cb) => cb !== callback);
  }

  public emit<T extends ScreenEvent>(event: T): void;
  public emit<T extends ScreenEvent>(event: T, data: Events[T]): void;
  public emit<T extends ScreenEvent>(event: T, data?: Events[T]): void {
    this._events[event].forEach((callback) => {
      if (data) {
        callback.callback(data);
      } else {
        callback.callback({} as any);
      }
    });
  }

  /**
   * Clear all callbacks for all events
   */
  public clear(): void {
    EventManager.eventNames.forEach((eventName) => {
      this._events[eventName] = [];
    });
  }

  /**
   * Get all registered events
   */
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
