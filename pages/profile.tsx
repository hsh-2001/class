import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import useAthentication from "@/hooks/useAthentication";
import useProfile from "@/hooks/useProfile";
import { Gender } from "@/prisma/generated/enums";
import { useEffect } from "react";
import { Alert, Avatar, Card, Col, Form, Row, Select, Skeleton, Space, Statistic, Typography } from "antd";

export default function Profile() {
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
    } = useProfile();

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    const initials = `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.trim() || "ST";
    const displayName = `${profile?.firstName || "Student"} ${profile?.lastName || ""}`.trim();
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
            <Space direction="vertical" size={24} className="w-full">
                <Card className="border-black/10 bg-white/80 dark:border-white/10 dark:bg-white/5" variant="outlined">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <Typography.Text className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                                Student Profile
                            </Typography.Text>
                            <Typography.Title level={2} className="!mt-3 mb-2! !text-slate-950 dark:!text-slate-50">
                                {isLoading ? "Loading profile..." : displayName}
                            </Typography.Title>
                            <Typography.Paragraph className="!mb-0 max-w-2xl !text-sm !text-slate-600 dark:!text-slate-300">
                                Keep your personal details current so classmates and teachers see the right account information.
                            </Typography.Paragraph>
                        </div>
                        <SButton type="button" color="danger" onClick={handleLogout}>Logout</SButton>
                    </div>
                </Card>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card className="border-black/10 bg-white/75 dark:border-white/10 dark:bg-white/5">
                            <Statistic title="Account Email" value={profile?.email || "No email available"} valueStyle={{ fontSize: 16 }} />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="border-black/10 bg-white/75 dark:border-white/10 dark:bg-white/5">
                            <Statistic title="Username" value={profile?.username || "--"} />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="border-black/10 bg-white/75 dark:border-white/10 dark:bg-white/5">
                            <Statistic title="Profile Completion" value={Math.round((profileCompletion / 6) * 100)} suffix="%" />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} xl={16}>
                        <Card className="border-black/10 bg-white/75 dark:border-white/10 dark:bg-white/5" title="Edit Profile Details">
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
                                        <Avatar
                                            size={64}
                                            src={profile?.profileUrl || undefined}
                                            className="bg-slate-900 text-white dark:bg-white dark:text-black"
                                        >
                                            {initials}
                                        </Avatar>
                                        <div>
                                            <Typography.Title copyable level={4} className="!mb-1 text-slate-950! dark:!text-slate-50">
                                                {displayName}
                                            </Typography.Title>
                                            <Typography.Text className="!text-sm text-slate-500! dark:!text-slate-400">
                                                Update the details used across the class system.
                                            </Typography.Text>
                                        </div>
                                    </div>

                                    <Row gutter={[16, 0]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Email">
                                                <SInput value={profile?.email || ""} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Username">
                                                <SInput
                                                    value={profile?.username || ""}
                                                    onChange={(value) => setProfileField("username", String(value))}
                                                    disabled={isLoading}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="First name">
                                                <SInput
                                                    value={profile?.firstName || ""}
                                                    onChange={(value) => setProfileField("firstName", String(value))}
                                                    disabled={isLoading}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Last name">
                                                <SInput
                                                    value={profile?.lastName || ""}
                                                    onChange={(value) => setProfileField("lastName", String(value))}
                                                    disabled={isLoading}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Phone">
                                                <SInput
                                                    value={profile?.phone || ""}
                                                    onChange={(value) => setProfileField("phone", String(value))}
                                                    disabled={isLoading}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Gender">
                                                <Select
                                                    value={profile?.gender || Gender.MALE}
                                                    onChange={(value) => setProfileField("gender", value as Gender)}
                                                    disabled={isLoading}
                                                    options={[
                                                        { label: "Male", value: Gender.MALE },
                                                        { label: "Female", value: Gender.FEMALE },
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
                                                    Reset
                                                </SButton>
                                                <SButton type="submit" color="primary" loading={isSubmitting}>
                                                    Save changes
                                                </SButton>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    )
}
