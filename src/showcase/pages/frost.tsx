import { HeartPulse, Moon, Video } from "lucide-react";
import { Frost, FrostDisc } from "@/components/ui/frost";
import { NotchCard, RoundAction } from "@/components/ui/notch-card";
import { Segments } from "@/components/ui/segments";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="frost-pane" files={["ui/frost"]} title="Pane" note="A clear glass pane for a small group of facts. It belongs on the aurora surface or on imagery; on a plain surface it has nothing to refract, so use a tone step there instead." bare className="items-stretch">
        <div className="flex w-full flex-wrap items-stretch gap-3 rounded-xl rovr-aurora p-card">
          <Frost className="min-w-44 flex-1">
            <p className="text-caption text-white/70">Next visit</p>
            <p className="text-title-lg">Thursday 3 December</p>
            <p className="text-body-sm text-white/70">10:30 with Dr. Okafor</p>
          </Frost>
          <Frost className="min-w-44 flex-1">
            <p className="text-caption text-white/70">LDL cholesterol</p>
            <p className="text-title-lg text-data">128 mg/dL</p>
            <p className="text-body-sm text-white/70">Down from 162 in August</p>
          </Frost>
          <Frost className="min-w-44 flex-1">
            <p className="text-caption text-white/70">Refills</p>
            <p className="text-title-lg text-data">2 left</p>
            <p className="text-body-sm text-white/70">Atorvastatin 20 mg</p>
          </Frost>
        </div>
      </Demo>
      <Demo id="frost-disc" files={["ui/frost"]} title="Disc" note="A round pane for one number or one icon, as on a watch face. Resize it with a size class." bare className="items-stretch">
        <div className="flex w-full flex-wrap items-center gap-4 rounded-xl rovr-aurora p-card">
          <FrostDisc>
            <span className="text-title-lg text-data">23</span>
          </FrostDisc>
          <FrostDisc>
            <HeartPulse className="size-6" aria-hidden />
          </FrostDisc>
          <FrostDisc className="size-12">
            <Moon className="size-5" aria-hidden />
          </FrostDisc>
          <FrostDisc className="size-12">
            <span className="text-title-sm text-data">72</span>
          </FrostDisc>
          <p className="text-body-sm text-white/85">Resting heart rate 72 bpm, measured overnight</p>
        </div>
      </Demo>
      <Demo id="frost-on-notch-card" files={["ui/frost", "ui/notch-card", "ui/segments"]} title="On the aurora card" note="The usual home for both: the one rich card at the top of a patient's day." bare className="items-stretch">
        <NotchCard tone="aurora" className="min-h-56 w-full justify-between gap-6" action={<RoundAction href="#/frost" label="Join visit" />}>
          <div className="flex items-center gap-3">
            <FrostDisc>
              <Video className="size-6" aria-hidden />
            </FrostDisc>
            <p className="text-body-sm leading-tight text-white/85">
              Video visit
              <br />
              in 10 minutes
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 pr-36">
            <p className="text-display-md">
              Dr. Ngozi Okafor
              <span className="block text-white/55">Review of lipid panel</span>
            </p>
            <Frost className="w-56">
              <p className="text-caption text-white/70">Before you join</p>
              <p className="text-title-lg text-data">2 of 3 done</p>
              <Segments className="mt-2" value={2} total={3} label="Pre-visit steps" tone="on-aurora" />
            </Frost>
          </div>
        </NotchCard>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "frost",
  title: "Frost",
  group: "Components",
  summary: "Clear glass panes, Frost and FrostDisc, for content that sits on the aurora surface or on a photograph. They are not for plain surfaces.",
  keywords: "glass pane blur translucent aurora disc",
  Body,
};
