export interface Option {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  test_id: number;
  text: string;
  points: number;
  is_multi_correct: boolean;
  options: Option[];
}

export interface Test {
  id: number;
  title: string;
  total_points: number;
  questions: Question[];
}

export interface OptionRequest {
  question_id: number;
  text: string;
  is_correct: boolean;
}

export interface QuestionRequest {
  test_id: number;
  text: string;
  points: number;
  is_multi_correct: boolean;
  options: OptionRequest[];
}

export interface TestRequest {
  id: number;
  title: string;
  total_points: number;
  questions: QuestionRequest[];
}

interface UserAnswer {
  question_id: number;
  selected_options: number[];
}

interface SubmitTestResponse {
  message: string;
  score: number;
  userData: User;
}

interface UpdateSatisfactionSurveyResponse {
  message: string;
  user: User;
}

interface SatisfactionSurvey {
  age: string;
  date: string;
  ease_of_use: string;
  occupation: string;
  overall_satisfaction: string;
  suggestions: string;
  usage_count: string;
  usage_period: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  fname: string;
  lname: string;
  tutorial: boolean;
  total_progress: number;
  student_id?: number | null;
  section?: string | null;
  adviser?: string | null;
  pre_test_score?: number | null;
  pre_test_date?: string | null;
  post_test_score?: number | null;
  post_test_date?: string | null;
  post_test_pass: boolean;
  highest_post_test_score?: number | null;
  highest_post_test_date?: string | null;
  remark?: string | null;
  visited_page?: string[];
  satisfaction_survey?: SatisfactionSurvey | null;
}

export interface UserInStorage {
  id: number;
  tutorial: boolean;
  total_progress: number;
  pre_test_score?: number | null;
  pre_test_date?: string | null;
  post_test_score?: number | null;
  post_test_date?: string | null;
  post_test_pass: boolean;
  visited_page?: string[];
  satisfaction_survey?: SatisfactionSurvey | null;
}

export interface JwtPayload {
  exp: number;
  id: number;
  email?: string;
  role: string;
  fname: string;
  lname: string;
  tutorial?: boolean;
  total_progress?: number;
  student_id?: number | null;
  pre_test_score?: number | null;
  pre_test_date?: string | null;
  post_test_score?: number | null;
  post_test_date?: string | null;
  post_test_pass: boolean;
  visited_page?: string[] | [];
  satisfaction_survey?: SatisfactionSurvey | null;
}

export interface Page {
  id: number;
  title: string;
  groups: Groups[];
  is_counted_in_progress: boolean;
}

export interface Groups {
  id: number;
  page_id: number;
  page_title: string;
  name: string;
  contents: Contents[];
}

export interface Contents {
  id: number;
  group_id: number;
  type: string;
  value: string;
  title_ref: string[];
  ref: string[];
  ref_type: string;
}
