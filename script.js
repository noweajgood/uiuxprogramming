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
    ? "구독을 시작할 수 있습니다." 
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

// 1. 전체 컨테이너 및 스텝/진행바 요소
const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress-item, .progress__item");

// 3. Step 1 (기본 정보: 이름)
const titleInput = document.querySelector("#dogName");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");

// 4. Step 2 (세부 정보: 나이, 몸무게, 중성화)
const dogAge = document.querySelector("#dogAge");
const ageError = document.querySelector("#age-error");
const dogWeight = document.querySelector("#dogWeight");
const weightError = document.querySelector("#weight-error");
const neuteredError = document.querySelector("#neutered-error");
const neuteredRadios = document.querySelectorAll('input[name="isNeutered"]');

// 이전/다음 버튼
const conditionPrev = document.querySelector("#condition-prev"); 
const conditionNext = document.querySelector("#condition-next");
const optionNext = conditionNext;

startButton.addEventListener("click", () => {
  recordingDialog.showModal();
});

// 5. Step 3 (최종 요약 확인창)
const summaryName = document.querySelector("#summary-name");
const summaryAge = document.querySelector("#summary-age");
const summaryWeight = document.querySelector("#summary-weight");
const summaryNeutered = document.querySelector("#summary-neutered");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");

// 6. 데이터 저장 객체 
const formData = {
  name: "",
  age: null,
  weight: null,
  isNeutered: "" // "Y" 또는 "N"
};

function showStep(index) {
  flowSteps.forEach((step, i) => { step.hidden = i !== index; });
  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  });
}

// 2. 다이얼로그 요소
const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
  recordingDialog.close(); // 다이얼로그 닫기
  trainingFlow.hidden = true; // 메인 폼 숨기기
}

// 1. 다이얼로그 취소/돌아가기 버튼 클릭 시
recordingCancel.addEventListener("click", () => {
  recordingDialog.close();
  revokeRecordingAgreement();
});

// 2. ESC 키 등으로 다이얼로그가 닫힐 때(cancel 이벤트) 취소 처리
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

// 3. 동의하고 설정 시작하기 버튼 클릭 시
recordingConfirm.addEventListener("click", () => {
  recordingDialog.close();
  trainingFlow.hidden = false;
  showStep(0);
  trainingFlow.scrollIntoView({ behavior: "smooth" });
  titleInput.focus();
});

function validateTitle() {
  const value = titleInput.value.trim();
  if (!value) {
    titleError.textContent = "강아지 이름을 입력해 주세요.";
    titleInput.classList.add("has-error");
    titleInput.focus();
    return false;
  }
  titleError.textContent = "";
  titleInput.classList.remove("has-error");
  formData.name = value; // 강사의 formData.title 대신 강아지 이름(name)으로 저장
  return true;
}

titleNext.addEventListener("click", () => {
  if (!validateTitle()) return;
  showStep(1); // 다음 단계(Step 2: 세부 정보)로 이동
});

// Step 2에서 '이전' 버튼 클릭 시 -> 1단계(인덱스 0)로 돌아가기
conditionPrev?.addEventListener("click", () => {
  showStep(0);
});

// Step 2에서 '다음' 버튼 클릭 시 (강사의 optionNext에 해당)
conditionNext.addEventListener("click", () => {
  // 1. 값 가져오기
  const age = dogAge.value.trim();
  const weight = dogWeight.value.trim();
  const neuteredRadio = document.querySelector('input[name="isNeutered"]:checked');

  // 2. 유효성 검사 (입력 확인)
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

  // 3. formData에 저장 (강사의 formData 저장 부분에 해당)
  formData.age = age;
  formData.weight = weight;
  formData.isNeutered = neuteredRadio.value;

  // 4. Step 3 요약 화면 텍스트 채우기 (강사의 summary... 부분에 해당)
  if (summaryName) summaryName.textContent = formData.name;
  if (summaryAge) summaryAge.textContent = formData.age + "살";
  if (summaryWeight) summaryWeight.textContent = formData.weight + "kg";
  if (summaryNeutered) {
    summaryNeutered.textContent = formData.isNeutered === "Y" ? "완료" : "미완료";
  }

  // 5. Step 3(인덱스 2)으로 이동
  showStep(2);
});

// Step 3(확인창)에서 '이전' 클릭 시 -> Step 2(인덱스 1)로 이동
summaryPrev?.addEventListener("click", () => showStep(1));

// 최종 완료 버튼 클릭 시 -> 완료 화면(인덱스 3)으로 이동
finishButton?.addEventListener("click", () => showStep(3));

// 다시 시작 버튼 클릭 시 -> 강아지 폼 데이터 및 UI 전체 초기화 후 Step 1(인덱스 0)로 복귀
restartButton?.addEventListener("click", () => {
  // 1. formData 객체 초기화
  formData.name = "";
  formData.age = "";
  formData.weight = "";
  formData.isNeutered = "";

  // 2. Step 1 입력창 및 에러 초기화
  titleInput.value = "";
  titleError.textContent = "";
  titleInput.classList.remove("has-error");

  // 3. Step 2 입력창 및 라디오 버튼 초기화
  dogAge.value = "";
  dogWeight.value = "";
  ageError.textContent = "";
  weightError.textContent = "";
  neuteredError.textContent = "";
  dogAge.classList.remove("has-error");
  dogWeight.classList.remove("has-error");

  document.querySelectorAll('input[name="isNeutered"]').forEach((radio) => {
    radio.checked = false;
  });

  // 4. Step 3 요약 화면 텍스트 초기화
  if (summaryName) summaryName.textContent = "";
  if (summaryAge) summaryAge.textContent = "";
  if (summaryWeight) summaryWeight.textContent = "";
  if (summaryNeutered) summaryNeutered.textContent = "";

  // 5. 첫 단계(Step 1: 인덱스 0)로 이동
  showStep(0);
});