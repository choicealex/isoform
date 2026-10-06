"use client";

import Link from "next/link";
import { useState } from "react";
import { EDGES, SIDES, Seg } from "@/components/spec/Icons";
import icons from "@/lib/icons.json";
import { LABEL } from "@/lib/spec";

/* one from each corner of the set: a building, a gear, a vehicle, a cart, a key, a card */
const PICKS = ["house", "settings", "rocket", "shopping-cart", "key", "credit-card"];
const rows = PICKS.map((id) => icons.find((i) => i.id === id)).filter((i) => i !== undefined);

/**
 * Isocons draws every icon six ways: rounded or sharp edges, seen from the left, the top or the right. Every row is one
 * icon, every column one view, rounded beside sharp. On a phone, one edge at a time.
 */
export function SixViews() {
  const [edge, setEdge] = useState<"rounded" | "sharp">("rounded");
  return (
    <div>
      <div className="flex items-center justify-between gap-4 px-4 pb-4 sm:px-8 md:hidden">
        <span className={LABEL}>Edge</span>
        <Seg label="Edge" value={edge} set={setEdge} options={EDGES} />
      </div>
      <div className="grid grid-cols-[minmax(0,5.5rem)_repeat(3,minmax(0,1fr))] border-y border-rule md:grid-cols-[minmax(0,8rem)_repeat(6,minmax(0,1fr))]">
        {/* heads: the edge over its three sides */}
        <div className="border-rule border-r border-b" />
        {EDGES.map(([e, label], k) => (
          <div key={e} className={`col-span-3 border-rule border-b px-4 py-3 ${k === 0 ? "md:border-r" : ""} ${e === edge ? "" : "max-md:hidden"}`}>
            <span className={LABEL}>{label} edges</span>
          </div>
        ))}
        <div className="border-rule border-r border-b" />
        {EDGES.flatMap(([e], k) =>
          SIDES.map(([s, label], j) => (
            <div key={`${e}-${s}`} className={`border-rule border-b px-4 py-2 ${j === 2 && k === 0 ? "md:border-r" : ""} ${e === edge ? "" : "max-md:hidden"}`}>
              <span className={`${LABEL} text-faint`}>{label}</span>
            </div>
          )),
        )}
        {rows.map((i, r) => (
          <Row key={i.id} id={i.id} title={i.title} edge={edge} last={r === rows.length - 1} />
        ))}
      </div>
      <p className="px-4 pt-4 text-[14px] text-muted sm:px-8">
        A figure is made from one view; ask for another by name, <code className="font-mono text-[13px] text-ink">/isoform-animate key sharp-top</code>.{" "}
        <Link href="/icons" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
          All 1,007 icons, in every view
        </Link>
      </p>
    </div>
  );
}

function Row({ id, title, edge, last }: { id: string; title: string; edge: string; last: boolean }) {
  return (
    <>
      <div className={`flex items-end border-rule border-r px-4 py-3 ${last ? "" : "border-b"}`}>
        <span className="font-mono text-[11px] break-all">{id}</span>
      </div>
      {EDGES.flatMap(([e], k) =>
        SIDES.map(([s], j) => (
          <div key={`${e}-${s}`} className={`flex aspect-[5/4] items-center justify-center border-rule p-[12%] ${last ? "" : "border-b"} ${j === 2 && k === 0 ? "md:border-r" : ""} ${e === edge ? "" : "max-md:hidden"}`}>
            {/* biome-ignore lint/performance/noImgElement: small static Isocons SVGs; next/image adds nothing here */}
            <img src={`/iso/all/${e}-${s}/${id}.svg`} alt={`${title}, ${e} edges, from the ${s}`} loading="lazy" className="iso-thumb size-full object-contain opacity-85" />
          </div>
        )),
      )}
    </>
  );
}
