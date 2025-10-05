import { createClient } from '@supabase/supabase-js'

// Supabase 설정 (실제 URL과 키는 환경변수로 설정)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경변수가 설정되지 않은 경우 경고
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. env.example 파일을 참고하여 .env 파일을 생성하세요.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)

// 프로젝트 관련 함수들
export const projectService = {
  // 모든 프로젝트 가져오기
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 프로젝트 생성
  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 프로젝트 업데이트
  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 프로젝트 삭제
  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// 투자자 관련 함수들
export const investorService = {
  // 투자자 생성 또는 업데이트
  async upsertInvestor(investor) {
    const { data, error } = await supabase
      .from('investors')
      .upsert([investor], { onConflict: 'wallet_address' })
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 지갑 주소로 투자자 조회
  async getInvestorByWallet(walletAddress) {
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // 모든 투자자 조회
  async getInvestors() {
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .order('total_invested', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// 투자 관련 함수들
export const investmentService = {
  // 투자 기록 생성
  async createInvestment(investment) {
    const { data, error } = await supabase
      .from('investments')
      .insert([investment])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 투자자별 투자 내역 조회
  async getInvestorInvestments(walletAddress) {
    const { data, error } = await supabase
      .rpc('get_investor_investments', { investor_wallet_address: walletAddress })
    
    if (error) throw error
    return data
  },

  // 프로젝트별 투자자 목록 조회
  async getProjectInvestors(projectId) {
    const { data, error } = await supabase
      .rpc('get_project_investors', { project_id_param: projectId })
    
    if (error) throw error
    return data
  },

  // 모든 투자 기록 조회
  async getInvestments() {
    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        investors!inner(name, wallet_address),
        projects!inner(title)
      `)
      .order('investment_date', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// 지출 관련 함수들
export const expenseService = {
  // 지출 생성
  async createExpense(expense) {
    const { data, error } = await supabase
      .from('project_expenses')
      .insert([expense])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // 프로젝트별 지출 조회
  async getProjectExpenses(projectId) {
    const { data, error } = await supabase
      .from('project_expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('expense_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 모든 지출 조회
  async getExpenses() {
    const { data, error } = await supabase
      .from('project_expenses')
      .select(`
        *,
        projects!inner(title)
      `)
      .order('expense_date', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// 통계 관련 함수들
export const statsService = {
  // 프로젝트 통계
  async getProjectStats() {
    const { data, error } = await supabase
      .from('project_stats')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // 투자자 통계
  async getInvestorStats() {
    const { data, error } = await supabase
      .from('investor_stats')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // 투자 통계
  async getInvestmentStats() {
    const { data, error } = await supabase
      .from('investment_stats')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // 프로젝트별 지출 통계
  async getProjectExpenseStats() {
    const { data, error } = await supabase
      .from('project_expense_stats')
      .select('*')
      .order('total_expenses', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 월별 투자 통계
  async getMonthlyInvestmentStats() {
    const { data, error } = await supabase
      .from('monthly_investment_stats')
      .select('*')
      .limit(12)
    
    if (error) throw error
    return data
  },

  // 월별 지출 통계
  async getMonthlyExpenseStats() {
    const { data, error } = await supabase
      .from('monthly_expense_stats')
      .select('*')
      .limit(12)
    
    if (error) throw error
    return data
  }
}
