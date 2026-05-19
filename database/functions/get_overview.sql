-- Function: get_overview(user_id)
-- Returns aggregated dashboard statistics for the admin overview page.
CREATE FUNCTION public.get_overview(user_id uuid)
RETURNS TABLE(
    total_students integer,
    total_teachers integer,
    total_classes integer,
    total_courses integer,
    total_groups integer,
    courses_with_classes jsonb,
    courses_with_no_classes jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH
    student_count AS (
        SELECT COUNT(*)::INT AS count FROM students
    ),
    teacher_count AS (
        SELECT COUNT(*)::INT AS count FROM teachers
    ),
    class_count AS (
        SELECT COUNT(*)::INT AS count FROM classes
    ),
    course_count AS (
        SELECT COUNT(*)::INT AS count FROM courses
    ),
    group_count AS (
        SELECT COUNT(*)::INT AS count
        FROM message_threads
        WHERE teacher_id IS NOT NULL
           OR class_id IS NOT NULL
           OR student_id IS NOT NULL
    ),
    courses_with_cls AS (
        SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'course_id', c.id,
                'course_name', c.name,
                'classes', cls.classes
            )
        ) AS data
        FROM courses c
        JOIN LATERAL (
            SELECT JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'class_id', cl.id,
                    'class_name', cl.name
                )
            ) AS classes
            FROM classes cl
            WHERE cl.course_id = c.id
        ) cls ON cls.classes IS NOT NULL
    ),
    courses_without_cls AS (
        SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'course_id', c.id,
                'course_name', c.name
            )
        ) AS data
        FROM courses c
        WHERE NOT EXISTS (
            SELECT 1 FROM classes cl WHERE cl.course_id = c.id
        )
    )

    SELECT
        s.count,
        t.count,
        cl.count,
        co.count,
        g.count,
        cwc.data,
        cwo.data
    FROM student_count s,
         teacher_count t,
         class_count cl,
         course_count co,
         group_count g,
         courses_with_cls cwc,
         courses_without_cls cwo;
END;
$$;
