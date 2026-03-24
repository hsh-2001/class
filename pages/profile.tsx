import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import useAthentication from "@/hooks/useAthentication";
import useProfile from "@/hooks/useProfile";
import { Gender } from "@/prisma/generated/enums";
import { useEffect } from "react";
import { Alert, Card, Col, Form, Row, Select, Skeleton, Space, Statistic, Typography } from "antd";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { School2Icon } from "lucide-react";

export default function Profile() {
    const { t } = useTranslation();
    const {
        handleLogout,
    } = useAthentication();

    const {
        profile,
        isLoading,
        isSubmitting,
        errorMessage,
        successMessage,
        fetchProfile,
        setProfileField,
        updateProfile,
        uploadProfilePicture,
    } = useProfile();

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    const displayName = `${profile?.firstName || t("profile.studentFallback")} ${profile?.lastName || ""}`.trim();
    const profileCompletion = [
        profile?.username,
        profile?.firstName,
        profile?.lastName,
        profile?.phone,
        profile?.gender,
        profile?.profileUrl,
    ].filter((value) => !!value).length;

    return (
        <div className="page-body">
            <Space vertical size={24} className="w-full">
                <Card className="border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5" variant="outlined">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            {/* <p className="text-xl font-medium">{t("profile.eyebrow")}</p> */}
                            {/* <Typography.Title level={2} className="!mt-3 mb-2! text-slate-950! dark:text-slate-50!">
                                {isLoading ? t("profile.loadingProfile") : displayName}
                            </Typography.Title> */}
                            {/* <Typography.Paragraph className="mb-0! max-w-2xl text-sm! !text-slate-600 dark:!text-slate-300">
                                {t("profile.description")}
                            </Typography.Paragraph> */}
                            <p className="text-md md:text-xl">
                                <School2Icon className="inline-block mr-2 mb-1" />
                                { profile?.schoolName && profile.schoolName }</p>
                        </div>
                        <SButton type="button" color="danger" onClick={handleLogout}>{t("profile.logout")}</SButton>
                    </div>
                </Card>

                <div className="w-full">
                    <Card className="border-black/10 bg-white/75 dark:border-white/10 dark:bg-white/5" title={t("profile.editTitle")}>
                        {isLoading && !profile ? (
                            <Skeleton active avatar paragraph={{ rows: 6 }} />
                        ) : (
                            <Form
                                layout="vertical"
                                onSubmitCapture={(event) => {
                                    event.preventDefault();
                                    if (!profile) return;
                                    updateProfile({
                                        username: profile.username,
                                        firstName: profile.firstName,
                                        lastName: profile.lastName,
                                        phone: profile.phone,
                                        gender: profile.gender,
                                        profileUrl: profile.profileUrl,
                                    });
                                }}
                            >
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="relative w-20 h-20 rounded-full">
                                        <input type="file"
                                            className=" absolute w-full h-full opacity-0"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    uploadProfilePicture(e.target.files[0]);
                                                }
                                            }} />
                                        {profile?.profileUrl && (
                                            <Image
                                                src={profile?.profileUrl}
                                                alt="Profile Picture"
                                                width={80}
                                                height={80}
                                                className="rounded-full object-cover w-20 h-20"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <Typography.Title copyable level={4} className="!mb-1 text-slate-950! dark:!text-slate-50">
                                            {displayName}
                                        </Typography.Title>
                                        <Typography.Text className="!text-sm text-slate-500! dark:!text-slate-400">
                                            {t("profile.updateDetails")}
                                        </Typography.Text>
                                    </div>
                                </div>

                                <Row gutter={[16, 0]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label={t("profile.email")}>
                                            <SInput value={profile?.email || ""} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label={t("profile.username")}>
                                            <SInput
                                                value={profile?.username || ""}
                                                onChange={(value) => setProfileField("username", String(value))}
                                                disabled={isLoading}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label={t("profile.firstName")}>
                                            <SInput
                                                value={profile?.firstName || ""}
                                                onChange={(value) => setProfileField("firstName", String(value))}
                                                disabled={isLoading}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label={t("profile.lastName")}>
                                            <SInput
                                                value={profile?.lastName || ""}
                                                onChange={(value) => setProfileField("lastName", String(value))}
                                                disabled={isLoading}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label={t("profile.phone")}>
                                            <SInput
                                                value={profile?.phone || ""}
                                                onChange={(value) => setProfileField("phone", String(value))}
                                                disabled={isLoading}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item label={t("profile.gender")}>
                                            <Select
                                                value={profile?.gender || Gender.MALE}
                                                onChange={(value) => setProfileField("gender", value as Gender)}
                                                disabled={isLoading}
                                                options={[
                                                    { label: t("profile.male"), value: Gender.MALE },
                                                    { label: t("profile.female"), value: Gender.FEMALE },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                    {errorMessage ? (
                                        <Col xs={24}>
                                            <Alert type="error" message={errorMessage} showIcon />
                                        </Col>
                                    ) : null}
                                    {successMessage ? (
                                        <Col xs={24}>
                                            <Alert type="success" message={successMessage} showIcon />
                                        </Col>
                                    ) : null}
                                    <Col xs={24}>
                                        <div className="flex justify-end gap-2">
                                            <SButton type="button" color="secondary" onClick={() => void fetchProfile()}>
                                                {t("common.reset")}
                                            </SButton>
                                            <SButton type="submit" color="primary" loading={isSubmitting}>
                                                {t("common.saveChanges")}
                                            </SButton>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Card>
                </div>
            </Space>
        </div>
    )
}
