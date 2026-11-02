const serviceName = "강아지 건강식 만들기";
let isSubscribed = false;
let submitCount = 0;


function makeSubscribeMessage(email, subscribed)  {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }
    
    return "이메일을 입력한 뒤 신청해주세요."; 
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");


function handleSubscribe(event) {
    event.preventDefault();
    const subscribeEmail = emailInput.value.trim();
    if (subscribeEmail === "") {
        subscribeMessage.textContent = 
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;
    subscribeMessage.textContent = 
        makeSubscribeMessage(subscribeEmail, isSubscribed);
    
    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheckbox = document.querySelector("#agreeCheckbox");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");
    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);
    
    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheckbox.checked;
    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed 
    ? "강아지 정보를 입력할 수 있습니다." 
    : "시작 버튼을 누르려면 동의가 필요합니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheckbox.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function(panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector("#" + targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false

}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

// ===================================================
// 1. 전체 컨테이너 및 다단계 폼 요소 (9주차 적용)
// ===================================================
const trainingFlow = document.querySelector("#training-flow");
const form = document.querySelector("#recipe-form");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress-item");

// Step 1: 반려견 이름 및 피드백 요소
const titleField = document.querySelector("#title-field");
const titleInput = document.querySelector("#dogName");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");

// Step 2: 세부 정보 및 조건부 알레르기 요소
const dogAge = document.querySelector("#dogAge");
const ageError = document.querySelector("#age-error");
const dogWeight = document.querySelector("#dogWeight");
const weightError = document.querySelector("#weight-error");
const neuteredError = document.querySelector("#neutered-error");
const allergyOption = document.querySelector("#allergy-option");
const allergyOptions = document.querySelector("#allergy-options");
const allergyTypeInputs = [...document.querySelectorAll('input[name="allergy-type"]')];

const conditionPrev = document.querySelector("#condition-prev");
const conditionNext = document.querySelector("#condition-next");

// Step 3: 요약 및 저장 상태 요소
const summaryName = document.querySelector("#summary-name");
const summaryAge = document.querySelector("#summary-age");
const summaryWeight = document.querySelector("#summary-weight");
const summaryNeutered = document.querySelector("#summary-neutered");
const summaryAllergy = document.querySelector("#summary-allergy");
const summaryPrev = document.querySelector("#summary-prev");
const saveButton = document.querySelector("#save-plan");
const submitStatus = document.querySelector("#submit-status");
const restartButton = document.querySelector("#restart-button");

// 테스트용 저장 실패 플래그 (?save-error=1 주소 접속 확인용)
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");

let currentStep = 1;

// ===================================================
// 2. 다이얼로그 제어
// ===================================================
const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
  recordingDialog.close();
  trainingFlow.hidden = true;
}

recordingCancel.addEventListener("click", revokeRecordingAgreement);
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

startButton.addEventListener("click", () => {
  recordingDialog.showModal();
});

recordingConfirm.addEventListener("click", () => {
  recordingDialog.close();
  trainingFlow.hidden = false;
  showStep(1);
  trainingFlow.scrollIntoView({ behavior: "smooth" });
  titleInput.focus();
});

// ===================================================
// 3. 조건부 알레르기 영역 상태 동기화 (유닛 01 실습 대응)
// ===================================================
function syncAllergyFields() {
  const open = allergyOption.checked;
  allergyOption.setAttribute("aria-expanded", String(open));
  allergyOptions.hidden = !open;
  allergyTypeInputs.forEach((input) => {
    input.disabled = !open;
  });
}

allergyOption.addEventListener("change", syncAllergyFields);
syncAllergyFields();

// ===================================================
// 4. 입력 경험 및 실시간 글자 수/검증 (유닛 02 실습 대응)
// ===================================================
function updateTitleExperience() {
  const length = titleInput.value.length;
  const enough = titleInput.value.trim().length >= 2;
  const invalid = titleInput.getAttribute("aria-invalid") === "true";

  titleCount.textContent = `${length} / 10자`;
  titleField.classList.toggle("is-valid", enough && !invalid);

  if (!invalid) {
    titleHelp.textContent = enough
      ? "입력 조건을 충족했습니다."
      : "반려견을 구분할 수 있도록 2자 이상 입력해 주세요.";
  }
}

function showTitleError(message) {
  titleInput.setAttribute("aria-invalid", "true");
  titleError.textContent = message;
  titleField.classList.remove("is-valid");
  titleField.classList.add("has-error");
  return false;
}

function clearTitleError() {
  titleInput.removeAttribute("aria-invalid");
  titleError.textContent = "";
  titleField.classList.remove("has-error");
  updateTitleExperience();
}

function validateTitle() {
  const title = titleInput.value.trim();

  if (!title) {
    return showTitleError("강아지 이름을 입력해 주세요.");
  }
  if (title.length < 2) {
    return showTitleError("강아지 이름을 2자 이상 입력해 주세요.");
  }

  clearTitleError();
  return true;
}

titleInput.addEventListener("input", () => {
  updateTitleExperience();
  if (titleInput.getAttribute("aria-invalid") === "true") {
    validateTitle();
  }
});

// ===================================================
// 5. 단계 전환 및 초점 이동
// ===================================================
function showStep(stepNumber) {
  currentStep = stepNumber;
  flowSteps.forEach((step, i) => {
    step.hidden = i !== (stepNumber - 1);
  });
  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === (stepNumber - 1));
  });

  // 새 단계 제목으로 초점 이동 (접근성 가이드 준수)
  const heading = flowSteps[stepNumber - 1].querySelector("h3");
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}

titleNext.addEventListener("click", () => {
  if (!validateTitle()) {
    titleInput.focus();
    return;
  }
  showStep(2);
});

conditionPrev?.addEventListener("click", () => showStep(1));
summaryPrev?.addEventListener("click", () => showStep(2));

// Step 2 -> Step 3 (요약 화면 데이터 바인딩)
conditionNext.addEventListener("click", () => {
  const age = dogAge.value.trim();
  const weight = dogWeight.value.trim();
  const neuteredRadio = document.querySelector('input[name="isNeutered"]:checked');

  let isValid = true;

  if (!age || Number(age) <= 0) {
    ageError.textContent = "올바른 나이를 입력해 주세요.";
    dogAge.classList.add("has-error");
    isValid = false;
  } else {
    ageError.textContent = "";
    dogAge.classList.remove("has-error");
  }

  if (!weight || Number(weight) <= 0) {
    weightError.textContent = "올바른 몸무게를 입력해 주세요.";
    dogWeight.classList.add("has-error");
    isValid = false;
  } else {
    weightError.textContent = "";
    dogWeight.classList.remove("has-error");
  }

  if (!neuteredRadio) {
    neuteredError.textContent = "중성화 여부를 선택해 주세요.";
    isValid = false;
  } else {
    neuteredError.textContent = "";
  }

  if (!isValid) return;

  // 요약 화면에 값 전달
  if (summaryName) summaryName.textContent = titleInput.value.trim();
  if (summaryAge) summaryAge.textContent = `${age}살`;
  if (summaryWeight) summaryWeight.textContent = `${weight}kg`;
  if (summaryNeutered) summaryNeutered.textContent = neuteredRadio.value === "Y" ? "완료" : "미완료";

  if (allergyOption.checked) {
    const selectedType = document.querySelector('input[name="allergy-type"]:checked')?.value || "선택됨";
    summaryAllergy.textContent = `주의 (${selectedType})`;
  } else {
    summaryAllergy.textContent = "없음";
  }

  showStep(3);
});

// ===================================================
// 6. submit 이벤트 통합 및 비동기 저장 처리 (유닛 03 실습 대응)
// ===================================================
function setSubmitState(loading, message) {
  form.setAttribute("aria-busy", String(loading));
  saveButton.disabled = loading;
  saveButton.textContent = loading ? "플랜 저장하는 중…" : "맞춤 건강식 플랜 저장하기 →";
  submitStatus.textContent = message;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function persistDogPlan(plan) {
  await wait(600);

  if (forceSaveFailure) {
    throw new Error("수업용 강제 저장 실패");
  }

  const plans = JSON.parse(localStorage.getItem("dogPlans") || "[]");
  plans.unshift(plan);
  localStorage.setItem("dogPlans", JSON.stringify(plans));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (currentStep === 1) {
    titleNext.click();
    return;
  }

  if (currentStep !== 3) return;

  // 제출 직전 1단계 이름 유효성 검사 (오류 시 해당 단계로 복귀 및 초점 이동)
  if (!validateTitle()) {
    showStep(1);
    window.requestAnimationFrame(() => {
      form.querySelector('[aria-invalid="true"]')?.focus();
    });
    return;
  }

  const data = new FormData(form);
  const plan = {
    id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`,
    dogName: String(data.get("dogName") || "").trim(),
    dogAge: String(data.get("dogAge") || "").trim(),
    dogWeight: String(data.get("dogWeight") || "").trim(),
    isNeutered: String(data.get("isNeutered") || ""),
    hasAllergy: data.get("hasAllergy") === "included",
    allergyType: String(data.get("allergy-type") || ""),
    createdAt: new Date().toISOString()
  };

  setSubmitState(true, "맞춤 건강식 플랜을 저장하고 있습니다.");

  try {
    await persistDogPlan(plan);
    document.querySelector("#complete-message").textContent =
      `‘${plan.dogName}’의 맞춤 건강식 플랜이 성공적으로 저장되었습니다.`;
    setSubmitState(false, "맞춤 플랜을 저장했습니다.");
    showStep(4);
  } catch {
    setSubmitState(
      false,
      "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요."
    );
  }
});

// 새 플랜 시작하기 (초기화)
restartButton?.addEventListener("click", () => {
  form.reset();
  syncAllergyFields();

  titleCount.textContent = "0 / 10자";
  titleHelp.textContent = "반려견을 구분할 수 있도록 2자 이상 입력해 주세요.";
  titleError.textContent = "";

  titleInput.removeAttribute("aria-invalid");
  titleField.classList.remove("is-valid", "has-error");
  setSubmitState(false, "");

  showStep(1);
  titleInput.focus();
});

// ===================================================
// 7. 맞춤 레시피 빠른 조회 카드 인터랙션 (기존 기능 유지)
// ===================================================
const recipeGoalSelect = document.querySelector("#recipeGoal");
const recipeGoalError = document.querySelector("#recipeGoalError");
const searchRecipeBtn = document.querySelector("#searchRecipeBtn");
const recipeResultBox = document.querySelector("#recipeResultBox");
const resultRecipeName = document.querySelector("#resultRecipeName");
const resultRecipeDesc = document.querySelector("#resultRecipeDesc");

const recipeData = {
  diet: {
    name: "단호박 닭가슴살 찜",
    desc: "기름기를 뺀 닭가슴살과 포만감을 주는 단호박으로 부담 없이 체중을 조절합니다."
  },
  allergy: {
    name: "저자극 오리고기 연근볼",
    desc: "육류 알레르기 발생 확률이 낮은 오리고기와 소화에 좋은 연근을 활용한 식단입니다."
  },
  vital: {
    name: "영양 가득 소고기 황태죽",
    desc: "단백질이 풍부한 소고기와 염분을 뺀 황태로 활력을 채워주는 보양 레시피입니다."
  }
};

searchRecipeBtn?.addEventListener("click", () => {
  const selectedGoal = recipeGoalSelect.value;

  if (!selectedGoal) {
    recipeGoalError.textContent = "식단 고민을 목록에서 선택해 주세요.";
    recipeGoalSelect.classList.add("has-error");
    recipeResultBox.hidden = true;
    return;
  }

  recipeGoalError.textContent = "";
  recipeGoalSelect.classList.remove("has-error");

  const result = recipeData[selectedGoal];
  resultRecipeName.textContent = "🍲 " + result.name;
  resultRecipeDesc.textContent = result.desc;
  recipeResultBox.hidden = false;
});