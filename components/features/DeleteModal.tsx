import { useTranslation } from "react-i18next"
import SButton from "../ui/SButton"
import SModal from "../ui/SModal"

export const DeleteModal = ({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void,
}) => {
    const { t } = useTranslation();

    return (
        <SModal
            isOpen={open}
            title={t('Delete')}
            onClose={onClose}
        >
            <main>
                <p>{t('Are you sure you want to delete this ?')}</p>
            </main>
            <div className="flex gap-2 justify-end">
                <SButton
                    type="button"
                    color="secondary"
                    onClick={onClose}
                >
                    {t('Cancel')}
                </SButton>
                <SButton
                    type="button"
                    color="danger"
                    onClick={onConfirm}
                >
                    {t('Confirm')}
                </SButton>
            </div>
        </SModal>
    )
}