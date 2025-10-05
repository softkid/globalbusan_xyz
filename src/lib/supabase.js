import { createClient } from '@supabase/supabase-js'

// Supabase 설정 (실제 URL과 키는 환경변수로 설정)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경변수 디버깅
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey ? '설정됨' : '설정되지 않음')

// 환경변수가 설정되지 않은 경우 경고
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.')
}

// Supabase 클라이언트 생성
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)

// 연결 상태 확인 함수
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('projects').select('count').limit(1)
    if (error) {
      console.error('Supabase 연결 실패:', error)
      return { connected: false, error: error.message }
    }
    console.log('Supabase 연결 성공')
    return { connected: true, error: null }
  } catch (error) {
    console.error('Supabase 연결 오류:', error)
    return { connected: false, error: error.message }
  }
}

// 연결 상태 관리
let connectionStatus = { connected: false, error: null, lastChecked: null }

// 주기적으로 연결 상태 확인 (5분마다)
setInterval(async () => {
  const status = await checkSupabaseConnection()
  connectionStatus = { ...status, lastChecked: new Date() }
}, 5 * 60 * 1000)

// 초기 연결 확인
checkSupabaseConnection().then(status => {
  connectionStatus = { ...status, lastChecked: new Date() }
})

export { connectionStatus }

// 기본 폴백 데이터
const fallbackData = {
  projects: [
    {
      id: 1,
      title: '부산 글로벌 비즈니스 허브 플랫폼',
      description: '국제 기업과 한국 기업을 연결하는 블록체인 기반 B2B 플랫폼',
      category: 'infrastructure',
      status: 'development',
      budget: 500000,
      raised: 125000,
      expected_return: 15.5,
      timeline: '12개월',
      crypto_type: 'ETH',
      progress: 35,
      team_size: 8,
      technologies: ['React', 'Node.js', 'Ethereum', 'IPFS']
    }
  ],
  projectStats: {
    total_projects: 6,
    total_budget: 3150000,
    total_raised: 1020000,
    avg_expected_return: 20.3,
    total_team_members: 66
  },
  investorStats: {
    total_investors: 8,
    avg_investment_per_investor: 127500,
    max_investment: 50000,
    min_investment: 10000,
    new_investors_30_days: 2
  },
  investmentStats: {
    total_investments: 23,
    total_investment_amount: 635000,
    confirmed_investments: 20,
    pending_investments: 2,
    failed_investments: 1,
    investments_30_days: 5
  }
}

// 프로젝트 관련 함수들
export const projectService = {
  // 모든 프로젝트 가져오기
  async getProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('프로젝트 데이터 로드 실패, 폴백 데이터 사용:', error.message)
        return fallbackData.projects
      }
      return data || fallbackData.projects
    } catch (error) {
      console.error('프로젝트 데이터 로드 오류:', error)
      return fallbackData.projects
    }
  },

  // 프로젝트 생성
  async createProject(project) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
      
      if (error) {
        console.error('프로젝트 생성 실패:', error)
        throw error
      }
      return data[0]
    } catch (error) {
      console.error('프로젝트 생성 오류:', error)
      throw error
    }
  },

  // 프로젝트 업데이트
  async updateProject(id, updates) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('프로젝트 업데이트 실패:', error)
        throw error
      }
      return data[0]
    } catch (error) {
      console.error('프로젝트 업데이트 오류:', error)
      throw error
    }
  },

  // 프로젝트 삭제
  async deleteProject(id) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('프로젝트 삭제 실패:', error)
        throw error
      }
    } catch (error) {
      console.error('프로젝트 삭제 오류:', error)
      throw error
    }
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
    try {
      const { data, error } = await supabase
        .from('project_stats')
        .select('*')
        .single()
      
      if (error) {
        console.warn('프로젝트 통계 로드 실패, 폴백 데이터 사용:', error.message)
        return fallbackData.projectStats
      }
      return data || fallbackData.projectStats
    } catch (error) {
      console.error('프로젝트 통계 로드 오류:', error)
      return fallbackData.projectStats
    }
  },

  // 투자자 통계
  async getInvestorStats() {
    try {
      const { data, error } = await supabase
        .from('investor_stats')
        .select('*')
        .single()
      
      if (error) {
        console.warn('투자자 통계 로드 실패, 폴백 데이터 사용:', error.message)
        return fallbackData.investorStats
      }
      return data || fallbackData.investorStats
    } catch (error) {
      console.error('투자자 통계 로드 오류:', error)
      return fallbackData.investorStats
    }
  },

  // 투자 통계
  async getInvestmentStats() {
    try {
      const { data, error } = await supabase
        .from('investment_stats')
        .select('*')
        .single()
      
      if (error) {
        console.warn('투자 통계 로드 실패, 폴백 데이터 사용:', error.message)
        return fallbackData.investmentStats
      }
      return data || fallbackData.investmentStats
    } catch (error) {
      console.error('투자 통계 로드 오류:', error)
      return fallbackData.investmentStats
    }
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
