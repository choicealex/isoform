"use client";

import { type Ref, useEffect, useImperativeHandle, useRef } from "react";
import { figureByName, type IsoHandle, iso } from "@/lib/iso";
import { useFx } from "./FxToggle";

export type FigureControls = { replay(): void };

type Props = {
  name: string;
  intensity?: number;
  speed?: number;
  /** the WebGL effect (on where the page shows a figure large; thumbnails leave it off to stay under the browser's context limit) */
  gl?: boolean;
  /** hold the story at one moment (ms), as the look's pictures do */
  t?: number;
  /** hide the state read-out */
  quiet?: boolean;
  className?: string;
  ref?: Ref<FigureControls>;
  /** called with the stage once the figure is mounted (its story length is on stage.dataset.storyTotal) */
  onStage?: (stage: HTMLElement) => void;
};

/** One live figure. The skill's engine draws it; this only gives it a stage and passes the controls on. */
export function Figure({ name, intensity = 0.5, speed = 1, gl = false, t, quiet, className, ref, onStage }: Props) {
  const fx = useFx();
  gl = gl && fx; // the reader's site-wide switch wins
  const stage = useRef<HTMLDivElement>(null);
  const handle = useRef<IsoHandle | null>(null);
  const meta = figureByName(name);
  const live = useRef({ intensity, speed, onStage });
  live.current = { intensity, speed, onStage };

  /* a new figure, effect or held moment is a new mount, on a stage of its own: a mount that resolves late (React
     mounts twice in development) clears only its own stage, never the live one */
  useEffect(() => {
    const box = stage.current;
    if (!box || !meta) return;
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;inset:0";
    box.appendChild(el);
    let gone = false;
    iso()
      .then(async (host) => {
        if (gone) return;
        const h = await host.mount(el, name, { src: meta.svg, intensity: live.current.intensity, speed: live.current.speed, gl, t });
        if (gone) h.destroy();
        else {
          handle.current = h;
          live.current.onStage?.(el);
        }
      })
      .catch((err) => { if (!gone) console.error(err); });
    return () => {
      gone = true;
      handle.current?.destroy();
      handle.current = null;
      el.remove();
    };
  }, [name, meta, gl, t]);

  useEffect(() => { handle.current?.set(intensity); }, [intensity]);
  useEffect(() => { handle.current?.speed(speed); }, [speed]);
  useImperativeHandle(ref, () => ({ replay: () => handle.current?.replay() }), []);

  return <div ref={stage} className={`relative aspect-[5/4] ${className ?? ""}`} data-quiet={quiet ? "" : undefined} />;
}
