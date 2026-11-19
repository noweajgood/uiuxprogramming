const serviceName = "강아지 건강식 만들기";
let isSubscribed = false;
let submitCount = 0;

// ===================================================
// 0. 메뉴 내비게이션, 현재 위치 표시(aria-current) 및 모바일 메뉴 제어
// ===================================================
const menuToggle = document.querySelector("#menuToggle");
const primaryNavList = document.querySelector("#primaryNavList");
const navLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll(".page-section");

const MOBILE_BREAKPOINT = 768;

function setCurrentMenu(sectionId) {
  if (!sectionId) return;
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").replace("#", "");
    const isMatch = targetId === sectionId;
    link.classList.toggle("is-current", isMatch);
    if (isMatch) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setMobileMenuOpen(isOpen) {
  primaryNavList.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "주요 메뉴 닫기" : "주요 메뉴 열기");
  menuToggle.textContent = isOpen ? "✕ 메뉴 닫기" : "☰ 메뉴 열기";
}

menuToggle?.addEventListener("click", () => {
  const isCurrentlyOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMobileMenuOpen(!isCurrentlyOpen);
});

// 모바일 메뉴 열려 있을 때 Escape 키로 닫고 토글 버튼에 초점 복귀
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMobileMenuOpen(false);
    menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    setMobileMenuOpen(false);
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      event.preventDefault();
      history.pushState({ sectionId: targetId }, "", href);
      setCurrentMenu(targetId);
      targetEl.scrollIntoView({ behavior: "smooth" });
      // 키보드 초점도 목적지 섹션으로 자연스럽게 이동
      targetEl.setAttribute("tabindex", "-1");
      targetEl.focus({ preventScroll: true });
    }

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setMobileMenuOpen(false);
    }
  });
});

function syncMenuFromLocation() {
  const hashId = location.hash.replace("#", "");
  if (hashId && document.getElementById(hashId)) {
    setCurrentMenu(hashId);
  } else if (pageSections.length > 0) {
    setCurrentMenu(pageSections[0].id);
  }
}

window.addEventListener("popstate", syncMenuFromLocation);
window.addEventListener("hashchange", syncMenuFromLocation);
window.addEventListener("DOMContentLoaded", syncMenuFromLocation);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setCurrentMenu(entry.target.id);
      }
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
);

pageSections.forEach((sec) => sectionObserver.observe(sec));

// ===================================================
// 구독 기능 (오류/완료 상태 기호 + 명확한 안내 문구)
// ===================================================
const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
  event.preventDefault();
  const subscribeEmail = emailInput.value.trim();

  if (subscribeEmail === "" || !subscribeEmail.includes("@")) {
    subscribeMessage.textContent = "⚠ 올바른 이메일 주소(예: dog@example.com)를 입력한 뒤 신청해 주세요.";
    subscribeMessage.classList.add("is-error");
    subscribeMessage.classList.remove("is-success");
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
    return;
  }

  emailInput.removeAttribute("aria-invalid");
  isSubscribed = true;
  submitCount += 1;
  subscribeMessage.textContent = `✓ ${subscribeEmail} 주소로 새로운 레시피 구독 신청이 완료되었습니다.`;
  subscribeMessage.classList.remove("is-error");
  subscribeMessage.classList.add("is-success");
  subscribeButton.textContent = "✓ 구독 신청 완료";
  subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

// ===================================================
// 테마, 닉네임, 동의 체크, 탭 UI (키보드 화살표 탐색 지원)
// ===================================================
const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheckbox = document.querySelector("#agreeCheckbox");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.textContent = isDark ? "☀ 라이트 테마로 바꾸기" : "🌙 다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
  const maxLength = nicknameInput.maxLength;
  const currentLength = Math.min(nicknameInput.value.length, maxLength);
  nicknameCount.textContent = `${currentLength} / ${maxLength}자`;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
  const agreed = agreeCheckbox.checked;
  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "✓ [동의 완료] 이제 '강아지 정보 입력하기' 버튼을 눌러 시작할 수 있습니다."
    : "[미동의] 시작 버튼을 누르려면 위 동의 항목에 체크해 주세요.";

  agreeMessage.classList.toggle("is-ready", agreed);
}

agreeCheckbox.addEventListener("change", handleAgreeChange);

const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];

function activateTab(targetTab, shouldFocus = false) {
  tabs.forEach((tab) => {
    const isSelected = tab === targetTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.setAttribute("tabindex", isSelected ? "0" : "-1");
  });

  panels.forEach((panel) => {
    const isMatch = panel.id === targetTab.dataset.target;
    panel.classList.toggle("is-active", isMatch);
    panel.hidden = !isMatch;
  });

  if (shouldFocus) {
    targetTab.focus();
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab, false));

  // 요구사항 3: 키보드 좌우 화살표/Home/End 키로 탭 이동 지원
  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    }
  });
});

// ===================================================
// 1. 전체 컨테이너 및 다단계 폼 요소
// ===================================================
const trainingFlow = document.querySelector("#training-flow");
const form = document.querySelector("#recipe-form");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress-item");

const titleField = document.querySelector("#title-field");
const titleInput = document.querySelector("#dogName");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");

const ageField = document.querySelector("#age-field");
const dogAge = document.querySelector("#dogAge");
const ageError = document.querySelector("#age-error");

const weightField = document.querySelector("#weight-field");
const dogWeight = document.querySelector("#dogWeight");
const weightError = document.querySelector("#weight-error");

const neuteredError = document.querySelector("#neutered-error");
const allergyOption = document.querySelector("#allergy-option");
const allergyOptions = document.querySelector("#allergy-options");
const allergyTypeInputs = [...document.querySelectorAll('input[name="allergy-type"]')];

const conditionPrev = document.querySelector("#condition-prev");
const conditionNext = document.querySelector("#condition-next");

const summaryName = document.querySelector("#summary-name");
const summaryAge = document.querySelector("#summary-age");
const summaryWeight = document.querySelector("#summary-weight");
const summaryNeutered = document.querySelector("#summary-neutered");
const summaryAllergy = document.querySelector("#summary-allergy");
const summaryPrev = document.querySelector("#summary-prev");
const saveButton = document.querySelector("#save-plan");
const submitStatus = document.querySelector("#submit-status");
const restartButton = document.querySelector("#restart-button");

const forceSaveFailure = new URLSearchParams(location.search).has("save-error");
let currentStep = 1;

// ===================================================
// 2. 다이얼로그 제어 (초점 관리 포함)
// ===================================================
const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
  recordingDialog.close();
  trainingFlow.hidden = true;
  startButton.focus(); // 취소 시 원래 버튼으로 초점 복귀
}

recordingCancel.addEventListener("click", revokeRecordingAgreement);
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

startButton.addEventListener("click", () => {
  recordingDialog.showModal();
  recordingConfirm.focus();
});

recordingConfirm.addEventListener("click", () => {
  recordingDialog.close();
  trainingFlow.hidden = false;
  showStep(1);
  trainingFlow.scrollIntoView({ behavior: "smooth" });
  titleInput.focus();
});

// ===================================================
// 3. 조건부 알레르기 영역 상태 동기화
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
// 4. 입력 경험 및 실시간 글자 수/검증 (색상 + 기호 피드백)
// ===================================================
function updateTitleExperience() {
  const length = titleInput.value.length;
  const enough = titleInput.value.trim().length >= 2;
  const invalid = titleInput.getAttribute("aria-invalid") === "true";

  titleCount.textContent = `${length} / 10자`;
  titleField.classList.toggle("is-valid", enough && !invalid);

  if (!invalid) {
    titleHelp.textContent = enough
      ? "✓ 입력 조건을 충족했습니다."
      : "반려견을 구분할 수 있도록 2자 이상 10자 이하로 입력해 주세요.";
  }
}

function showTitleError(message) {
  titleInput.setAttribute("aria-invalid", "true");
  titleError.textContent = `⚠ ${message}`;
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
    step.hidden = i !== stepNumber - 1;
  });
  progressItems.forEach((item, i) => {
    const isCurrent = i === stepNumber - 1;
    item.classList.toggle("is-active", isCurrent);
    if (isCurrent) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }
  });

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

conditionNext.addEventListener("click", () => {
  const age = dogAge.value.trim();
  const weight = dogWeight.value.trim();
  const neuteredRadio = document.querySelector('input[name="isNeutered"]:checked');

  let firstInvalidEl = null;

  if (!age || Number(age) <= 0) {
    ageError.textContent = "⚠ 1 이상의 올바른 강아지 나이를 입력해 주세요.";
    dogAge.setAttribute("aria-invalid", "true");
    ageField.classList.add("has-error");
    if (!firstInvalidEl) firstInvalidEl = dogAge;
  } else {
    ageError.textContent = "";
    dogAge.removeAttribute("aria-invalid");
    ageField.classList.remove("has-error");
  }

  if (!weight || Number(weight) <= 0) {
    weightError.textContent = "⚠ 0보다 큰 올바른 강아지 몸무게(kg)를 입력해 주세요.";
    dogWeight.setAttribute("aria-invalid", "true");
    weightField.classList.add("has-error");
    if (!firstInvalidEl) firstInvalidEl = dogWeight;
  } else {
    weightError.textContent = "";
    dogWeight.removeAttribute("aria-invalid");
    weightField.classList.remove("has-error");
  }

  if (!neuteredRadio) {
    neuteredError.textContent = "⚠ 중성화 여부(완료 또는 미완료)를 선택해 주세요.";
    if (!firstInvalidEl) firstInvalidEl = document.querySelector("#neutered-y");
  } else {
    neuteredError.textContent = "";
  }

  if (firstInvalidEl) {
    firstInvalidEl.focus();
    return;
  }

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
// 6. submit 이벤트 통합 및 비동기 저장 처리
// ===================================================
function setSubmitState(loading, message) {
  form.setAttribute("aria-busy", String(loading));
  saveButton.disabled = loading;
  saveButton.textContent = loading ? "플랜 저장하는 중…" : "맞춤 건강식 플랜 저장하기";
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

  setSubmitState(true, "맞춤 건강식 플랜을 저장하고 있습니다…");

  try {
    await persistDogPlan(plan);
    document.querySelector("#complete-message").textContent =
      `✓ ‘${plan.dogName}’의 맞춤 건강식 플랜이 성공적으로 저장되었습니다. 아래 ‘내 강아지 건강식 플랜 목록’에서 확인할 수 있습니다.`;
    setSubmitState(false, "✓ 맞춤 플랜을 저장했습니다.");
    showStep(4);
    renderSavedPlans();
  } catch {
    setSubmitState(
      false,
      "⚠ 저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요."
    );
  }
});

restartButton?.addEventListener("click", () => {
  form.reset();
  syncAllergyFields();

  titleCount.textContent = "0 / 10자";
  titleHelp.textContent = "반려견을 구분할 수 있도록 2자 이상 10자 이하로 입력해 주세요.";
  titleError.textContent = "";

  titleInput.removeAttribute("aria-invalid");
  titleField.classList.remove("is-valid", "has-error");
  setSubmitState(false, "");

  showStep(1);
  titleInput.focus();
});

// ===================================================
// 7. 맞춤 레시피 빠른 조회 카드 인터랙션
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
    recipeGoalError.textContent = "⚠ 식단 고민 항목을 목록에서 먼저 선택해 주세요.";
    recipeGoalSelect.setAttribute("aria-invalid", "true");
    recipeGoalSelect.classList.add("has-error");
    recipeResultBox.hidden = true;
    recipeGoalSelect.focus();
    return;
  }

  recipeGoalError.textContent = "";
  recipeGoalSelect.removeAttribute("aria-invalid");
  recipeGoalSelect.classList.remove("has-error");

  const result = recipeData[selectedGoal];
  resultRecipeName.textContent = `추천 레시피: ${result.name}`;
  resultRecipeDesc.textContent = result.desc;
  recipeResultBox.hidden = false;
});

// ===================================================
// 8. 저장된 강아지 플랜 목록 탐색 및 필터링 (기호+색상 상태 구분)
// ===================================================
const filterButtons = document.querySelectorAll(".filter-btn");
const planCountStatus = document.querySelector("#planCountStatus");
const planEmptyState = document.querySelector("#planEmptyState");
const planEmptyMessage = document.querySelector("#planEmptyMessage");
const emptyGoCreateBtn = document.querySelector("#emptyGoCreateBtn");
const savedPlanList = document.querySelector("#savedPlanList");

const FILTER_LABELS = {
  all: "전체",
  allergy: "알레르기 케어",
  "no-allergy": "일반 식단 (알레르기 없음)",
  neutered: "중성화 완료"
};

let currentFilter = "all";

function getStoredPlans() {
  try {
    return JSON.parse(localStorage.getItem("dogPlans") || "[]");
  } catch {
    return [];
  }
}

function getRecommendedMealSummary(plan) {
  if (plan.hasAllergy) {
    return `저자극 맞춤 식단 (${plan.allergyType || "주의 식재료"} 제외)`;
  }
  if (Number(plan.dogAge) >= 7) {
    return "시니어 원기 회복 소고기 황태죽";
  }
  return "균형 영양 단호박 닭가슴살 찜";
}

function filterPlans(plans, filterKey) {
  switch (filterKey) {
    case "allergy":
      return plans.filter((p) => p.hasAllergy === true);
    case "no-allergy":
      return plans.filter((p) => p.hasAllergy === false);
    case "neutered":
      return plans.filter((p) => p.isNeutered === "Y");
    case "all":
    default:
      return plans;
  }
}

function renderSavedPlans() {
  const allPlans = getStoredPlans();
  const filteredPlans = filterPlans(allPlans, currentFilter);

  planCountStatus.textContent = `현재 [${FILTER_LABELS[currentFilter]}] 조건으로 총 ${filteredPlans.length}개의 플랜이 표시됩니다. (전체 ${allPlans.length}개)`;
  savedPlanList.innerHTML = "";

  if (allPlans.length === 0) {
    planEmptyState.hidden = false;
    planEmptyMessage.textContent =
      "아직 저장된 강아지 건강식 플랜이 없습니다. 위 ‘강아지 정보 입력하기’에서 첫 플랜을 만들어 보세요.";
    emptyGoCreateBtn.hidden = false;
    return;
  }

  if (filteredPlans.length === 0) {
    planEmptyState.hidden = false;
    planEmptyMessage.textContent =
      `선택한 [${FILTER_LABELS[currentFilter]}] 조건에 해당하는 플랜이 없습니다. 다른 필터를 선택하거나 ‘전체’를 확인해 보세요.`;
    emptyGoCreateBtn.hidden = true;
    return;
  }

  planEmptyState.hidden = true;

  filteredPlans.forEach((plan) => {
    const li = document.createElement("li");
    li.className = "plan-card";

    const neuteredLabel = plan.isNeutered === "Y" ? "중성화 완료" : "중성화 미완료";
    const allergyBadge = plan.hasAllergy
      ? `<span class="badge badge-allergy">⚠ 알레르기 주의: ${plan.allergyType}</span>`
      : `<span class="badge badge-normal">✓ 알레르기 없음</span>`;

    const dateText = plan.createdAt
      ? new Date(plan.createdAt).toLocaleDateString("ko-KR")
      : "";

    li.innerHTML = `
      <div class="plan-card-header">
        <h3>${plan.dogName}</h3>
        ${allergyBadge}
      </div>
      <p class="plan-meta">${plan.dogAge}살 · ${plan.dogWeight}kg · ${neuteredLabel}</p>
      <p class="plan-recommend"><strong>추천 식단:</strong> ${getRecommendedMealSummary(plan)}</p>
      <div class="plan-card-footer">
        <small>등록일: ${dateText}</small>
        <button type="button" class="btn-delete-plan" data-id="${plan.id}" aria-label="${plan.dogName} 맞춤 플랜 삭제">삭제</button>
      </div>
    `;

    savedPlanList.appendChild(li);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => {
      const isSelected = b === btn;
      const key = b.dataset.filter;
      b.classList.toggle("is-active", isSelected);
      b.setAttribute("aria-pressed", String(isSelected));
      b.textContent = isSelected ? `✓ ${FILTER_LABELS[key]}` : FILTER_LABELS[key];
    });
    renderSavedPlans();
  });
});

savedPlanList?.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".btn-delete-plan");
  if (!deleteBtn) return;

  const targetId = deleteBtn.dataset.id;
  const updated = getStoredPlans().filter((p) => p.id !== targetId);
  localStorage.setItem("dogPlans", JSON.stringify(updated));
  renderSavedPlans();
});

emptyGoCreateBtn?.addEventListener("click", () => {
  const targetSection = document.getElementById("event_practice");
  targetSection?.scrollIntoView({ behavior: "smooth" });
  setCurrentMenu("event_practice");
  agreeCheckbox?.focus();
});

renderSavedPlans();