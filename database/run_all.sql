-- ============================================================================
-- run_all.sql
-- Execute all SQL files in the correct dependency order to set up the
-- database schema from scratch.
--
-- Usage:
--   psql -d your_database -f database/run_all.sql
-- ============================================================================

-- ============================================================================
-- 1. Custom Types (no dependencies)
-- ============================================================================
\ir types/gender.sql
\ir types/role.sql

-- ============================================================================
-- 2. Tables (ordered by dependency — parent tables before child tables)
-- ============================================================================
\ir tables/schools.sql
\ir tables/users.sql
\ir tables/teachers.sql
\ir tables/students.sql
\ir tables/user_profiles.sql
\ir tables/courses.sql
\ir tables/classes.sql
\ir tables/course_materials.sql
\ir tables/enrollments.sql
\ir tables/assignments.sql
\ir tables/lessons.sql
\ir tables/message_threads.sql
\ir tables/messages.sql
\ir tables/message_thread_reads.sql

-- ============================================================================
-- 3. Function (references tables, so placed after all table definitions)
-- ============================================================================
\ir functions/get_overview.sql
