import buttonStyles from "@/app/management/_window/post/components/button.module.scss";



type ButtonProps = {
    primary: {
        text: string;
        onClick?: () => void;
    };
    secondary: {
        text: string;
        onClick?: () => void;
    };
    danger?: {
        text: string;
        onClick?: () => void;
    };
};

export default function Button({primary, secondary, danger}: ButtonProps) {

    return (
        <div className={buttonStyles.buttonArea}>
            {
                danger ? (
                    <button
                        className={buttonStyles.secondary}
                        onClick={danger.onClick}
                        type="button">
                        <span>{danger.text}</span>
                    </button>
                ) : (
                    <div></div>
                )
            }
            <div className={buttonStyles.actionButtons}>
                <button className={buttonStyles.secondary}
                        onClick={secondary.onClick}>
                    <span>{secondary.text}</span>
                </button>
                <button className={buttonStyles.primary}
                        onClick={primary.onClick}>
                    <span>{primary.text}</span>
                </button>
            </div>
        </div>
    )
}

