"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STEPS = ["nickname", "team", "alarm"] as const;
type Steps = (typeof STEPS)[number];

const FIRST_STEP: Steps = "nickname";

const STEPS_PARAM_PREFIX = "steps";
const COMPLET_ROUTE = "complete";

type Setup = {
  nickname: string;
  team: {
    a: boolean;
    b: boolean;
  };
  alarm: boolean;
};

export default function Home() {
  const [setup, setSetup] = useState<Setup>({
    nickname: "",
    team: { a: false, b: false },
    alarm: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const steps = searchParams.get("steps") as Steps;

  const initRoute = useCallback(() => {
    router.replace(`?${STEPS_PARAM_PREFIX}=${FIRST_STEP}`);
  }, [router]);

  const nextStep = (steps: Steps) => {
    router.push(`?${STEPS_PARAM_PREFIX}=${steps}`);
  };

  const completeStep = () => {
    router.push(COMPLET_ROUTE);
  };

  const registSetup = (
    regist: Partial<Setup> | ((setup: Setup) => Partial<Setup>),
  ) => {
    const next = typeof regist === "function" ? regist(setup) : regist;

    setSetup((prev) => ({
      ...prev,
      ...next,
    }));
  };

  useEffect(() => {
    initRoute();
  }, [initRoute]);

  return (
    <main>
      <div className="flex flex-col items-center justify-between pt-24 ml-[-420px]">
        {steps === "nickname" && (
          <NicknameStep
            setup={setup}
            registSetup={registSetup}
            nextStep={() => nextStep("team")}
          />
        )}
        {steps === "team" && (
          <TeamStep
            setup={setup}
            registSetup={registSetup}
            nextStep={() => nextStep("alarm")}
          />
        )}
        {steps === "alarm" && (
          <AlarmStep
            setup={setup}
            registSetup={registSetup}
            completeStep={completeStep}
          />
        )}
      </div>
    </main>
  );
}

function NicknameStep({
  setup,
  registSetup,
  nextStep,
}: {
  setup: Setup;
  registSetup: (regist: Partial<Setup>) => void;
  nextStep: () => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    registSetup({ nickname: value });
  };

  return (
    <div className="flex flex-col gap-y-8">
      <label>
        <input
          type="text"
          value={setup.nickname}
          placeholder="닉네임을 입력해주세요."
          onChange={handleInputChange}
          className="border"
        />
      </label>
      <NextStepButton onClick={nextStep} />
    </div>
  );
}

function TeamStep({
  setup,
  registSetup,
  nextStep,
}: {
  setup: Setup;
  registSetup: (regist: (setup: Setup) => Partial<Setup>) => void;

  nextStep: () => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    const side = id.slice(-1);

    if (side === "a" || side === "b") {
      registSetup((prev) => ({
        team: { ...prev["team"], [side]: checked },
      }));
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gapy-x-4">
        <label>
          <input
            type="checkbox"
            id="team-a"
            checked={setup.team.a}
            onChange={handleInputChange}
          />
          Team A
        </label>
        <label>
          <input
            type="checkbox"
            id="team-b"
            checked={setup.team.b}
            onChange={handleInputChange}
          />
          Team B
        </label>
      </div>
      <NextStepButton onClick={nextStep} />
    </div>
  );
}

function AlarmStep({
  setup,
  registSetup,
  completeStep,
}: {
  setup: Setup;
  registSetup: (regist: Partial<Setup>) => void;
  completeStep: () => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    registSetup({ alarm: checked });
  };

  return (
    <div className="flex flex-col gap-y-8">
      <label>
        <input
          type="checkbox"
          checked={setup.alarm}
          onChange={handleInputChange}
        />
        알람 받기
      </label>
      <NextStepButton onClick={completeStep} />
    </div>
  );
}

function NextStepButton(props: React.ComponentPropsWithoutRef<"button">) {
  return <button {...props}>다음</button>;
}
