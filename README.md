# React abstract dialog

-   해당 라이브러리는 리액트에서 동작하는 dialog 관리 context 입니다.
-   쉽게 confirm, alert, toast 그리고 custom dialog 들을 해당 컨텍스트로 관리 할 수 있습니다.

# Installation

```bash
$ npm install @edge-effect/react-abstract-dialog
```

# Usage

## 모든 컴포넌트가 쓸 수 있도록 `DialogContextProvider`를 감쌉니다.

```typescript
<DialogContextProvider>{/* your components */}</DialogContextProvider>
```

## Props of `DialogContextProvider`

-   `experimental_withHistory`: 브라우저 뒤로/앞으로 등의 기록 처리를 실험적으로 설정합니다.
-   `experimental_withHistoryForwardRestore`: `experimental_withHistory` 가 활성화 됬을 때 실험적으로 히스토리 앞으로가기에 대해 dialog 를 복원하는 기능을 설정 합니다.
-   `experimental_historySearchParamKey`: 브라우저 기록 처리 시 사용되는 키 값을 실험적으로 정의합니다.
-   `visibleMultipleDialog`: 대화 상자를 스택 형태로 계속 노출할지 아니면 하나의 대화 상자만 노출할지 여부.
-   `DialogContainer`: 대화 상자를 래핑하는 컨테이너 구성 요소를 제공할 수 있습니다.
-   `ToastContainer`: 토스트를 포장하는 컨테이너 구성 요소를 제공할 수 있습니다.
-   `Alert`: 경고를 표시하는 구성요소를 제공합니다. 경고를 표시하려는 경우 필수입니다.
-   `Confirm` : 확인을 표시하는 컴포넌트를 제공합니다. 확인을 표시하려면 필수입니다.
-   `Toast`: 토스트를 표시하는 구성 요소를 제공합니다. 토스트를 표시하려는 경우 필수입니다.
-   `onInterceptScrollBlocking`: 대화상자가 표시될 때 적절한 작업을 처리할 수 있는 이벤트 리스너입니다.

## 경고, 확인, 알림을 컨텍스트에서 사용할 수 있도록 구성 요소를 제공해야 합니다.

```typescript
import Confirm from "./component/popup/confirm";
import Alert from "./component/popup/alert";
import Toast from "./component/popup/toast";

<DialogContextProvider
    experimental_withHistory={true}
    ToastContainer={({ children }: { children: ReactNode }) => {
        return <div className="toast-container">{children}</div>;
    }}
    Confirm={Confirm}
    Alert={Alert}
    Toast={Toast}>
    {/* your components */}
</DialogContextProvider>;
```

-   컨텍스트를 통해 `confirm`만 사용하는 경우, `alert` 및 `toast`를 제공할 필요가 없습니다.

## `useDialogContext`를 사용하여 dialog를 제어합니다.

```typescript
const MyComponent = () => {
    const { confirm } = useDialogContext();
    return (
        <>
            <button
                onClick={async () => {
                    if (await confirm({ title: "Hello", message: "Select your answer" })) {
                        console.log("result is true");
                    } else {
                        console.log("result is false");
                    }
                }}>
                Show confirm
            </button>
        </>
    );
};
```

-   `DialogContextProvider`에서 제공하는 `confirm`, `alert`, `showDialog`는 Promise를 리턴 합니다.
-   `confirm`은 Promise<boolean>, `alert`은 Promise<void>를 리턴합니다.
-   `showDialog`는 Promise 반환 값을 원하는 대로 설정할 수 있습니다.

## Confirm, alert, and toast 는 어떤식으로 제공 해야 하나요?

-   `useDialogContext` 로부터 `confirm`, `alert`, `toast` 를 호출하면, `DialogContextProvider` 에 전달한 `Confirm`, `Alert`, `Toast` props 를 사용합니다.
-   전달한 props 들은 컴포넌트로 아래와 같이 직접 구현해서 전달해야 하고, 각 각 `AlertProps`, `ConfirmProps`, `ToastProps` 를 사용하거나 상속 받아야 합니다.
-   예를들어...

    ```typescript
    import { AlertProps, useDialogActionContext } from "@edge-effect/react-abstract-dialog";

    const Alert = ({ title, message, textOk = "ok" }: AlertProps) => {
        const { hide } = useDialogActionContext();
        return (
            <>
                <section className="dialog">
                    <div
                        className="dialog-dimmed"
                        onClick={() => {
                            hide();
                        }}
                    />
                    <div className="dialog-content">
                        <h1>{title}</h1>
                        <h2>{message}</h2>
                        <ul className="horizontal">
                            <li>
                                <button
                                    onClick={() => {
                                        hide();
                                    }}>
                                    {textOk}
                                </button>
                            </li>
                        </ul>
                    </div>
                </section>
            </>
        );
    };

    export default Alert;
    ```

-   위의 예시에서 `DialogContextProvider` 의해 관리될 dialog 는 `useDialogActionContext` 를 사용 해서 상호작용 해야 합니다. 해당 컨텍스트에서 `hide` 또는 `hideAfter` 등을 통해 dialog를 제어 해야 합니다.
-   `hide` 또는 `hideAfter` 를 호출하면서 dialog 가 dismiss 되어야만 promise 가 resolve 됩니다.

## Customize dialog

-   직접 dialog를 디자인하고 값을 호출부에 전달 할 수 있습니다.
-   커스텀 dialog로 사용할 컴포넌트를 제작 합니다.
-   예를들어

    ```typescript
    type Choice = { id: number; display: string };

    export type MyCustomDialogResult = Array<Choice>;

    interface MyCustomDialogProps {
        choices: Array<Choice>;
    }

    const MyCustomDialog = ({ choices }: MyCustomDialogProps) => {
        const { hide } = useDialogActionContext<MyCustomDialogResult>();

        const checkedChoiceInfo = useRef<{ [id: string]: { isChecked: boolean; data: Choice } }>({});

        return (
            <>
                <section className="dialog">
                    <div
                        className="dialog-dimmed"
                        onClick={() => {
                            hide();
                        }}
                    />
                    <div className="dialog-content">
                        <h2>Select your choice</h2>
                        <ul>
                            {choices.map((choice) => {
                                const checkboxId = `checkboxId-${choice.id}-${choice.display}`;
                                return (
                                    <li key={choice.id}>
                                        <input
                                            type="checkbox"
                                            id={checkboxId}
                                            value={choice.id}
                                            onChange={(event) => {
                                                const isChecked = event.target.checked;
                                                if (checkedChoiceInfo.current[event.target.value] !== undefined) {
                                                    checkedChoiceInfo.current[event.target.value].isChecked = isChecked;
                                                } else {
                                                    checkedChoiceInfo.current[event.target.value] = {
                                                        isChecked: isChecked,
                                                        data: choice,
                                                    };
                                                }
                                            }}
                                        />
                                        <label htmlFor={checkboxId}>{choice.display}</label>
                                    </li>
                                );
                            })}
                        </ul>
                        <ul className="horizontal">
                            <li>
                                <button
                                    onClick={() => {
                                        hide();
                                    }}>
                                    Dismiss
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        const selectedList: MyCustomDialogResult = [];
                                        const entries = Object.entries(checkedChoiceInfo.current);
                                        for (const [, value] of entries) {
                                            if (value.isChecked) {
                                                selectedList.push(value.data);
                                            }
                                        }
                                        hide(selectedList);
                                    }}>
                                    Select
                                </button>
                            </li>
                        </ul>
                    </div>
                </section>
            </>
        );
    };

    export default MyCustomDialog;
    ```

-   `useDialogActionContext` 에 데이터 유형을 전달 해서 `hide` 를 호출 할 때 값의 일관성을 갖도록 합니다. `hide` 는 `undefined` 를 전달 할 수 있습니다.

-   해당 dialog 를 표시하고자 하는 코드에서 아래와 같이 dialog를 제어 합니다.

    ```typescript
    <button
        onClick={async () => {
            const dialog = await showDialog<MyCustomDialogResult>(<MyCustomDialog choices={choices} />);
            console.log("result", dialog.result);
        }}>
        Show custom dialog
    </button>
    ```

-   promise 는 {id, result} 를 리턴합니다. 해당 dialog 에서 전달 하는 값은 result 객체에 있습니다. 값을 사용하세요!

## 주의해주세요!

### Dialog 에서 다른 페이지로 리디렉션

-   `withHistory` 기능을 활성화 하면, 브라우저 히스토리가 쌓이게 되고. 쌓인 상태로 dialog 에서 외부 또는 내부로 redirect 하려고 할 때 문제가 발생 할 수 있습니다.

    -   브라우저 히스토리가 쌓인 상태로 새로운 페이지로 리디렉션 한 뒤 다시 돌아오면 동작되지 않는 히스토리가 쌓여 문제가 됩니다.
    -   `useDialogContext` 또는 `useDialogActionContext` 의 `doNavigate` 로 redirect 코드를 작성해야 합니다.
    -   예를들어

    ```typescript
    // 이렇게 리디렉션 하면 히스토리 문제가 됩니다.
    navigate("/hello-world");
    // 대신 doNavigate 로 감싸야 합니다. doNavigate로 감싸면 리디렉션 전에 dialog와 관련된 브라우저 히스토리를 제거한 뒤 리디렉션 합니다.
    doNavigate(() => navigate("/hello-world"));
    ```

    -   자세한 내용은 dialog example 의 redirect 관련 내용을 참고하세요. (`redirect-example-dialog.tsx`)
