// Global BUSAN investment project contract for Sui blockchain
module globalbusan::investment_project {
    use sui::balance::Balance;
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::object::UID;
    use sui::sui::SUI;
    use sui::tx_context::TxContext;
    use sui::vec_map::VecMap;
    use std::string::String;

    // Error codes
    const E_INSUFFICIENT_AMOUNT: u64 = 1;
    const E_PROJECT_NOT_ACTIVE: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_INVESTMENT_CAP_REACHED: u64 = 4;
    const E_BELOW_MIN_INVESTMENT: u64 = 5;

    // Events
    public struct ProjectCreatedEvent has copy, drop {
        project_id: address,
        name: String,
        target_amount: u64,
        min_investment: u64,
    }

    public struct InvestmentEvent has copy, drop {
        project_id: address,
        investor: address,
        amount: u64,
        timestamp: u64,
    }

    public struct ProjectFundedEvent has copy, drop {
        project_id: address,
        total_raised: u64,
        investor_count: u64,
    }

    // Investment project
    public struct InvestmentProject has key {
        id: UID,
        name: String,
        description: String,
        creator: address,
        target_amount: u64,
        min_investment: u64,
        balance: Balance<SUI>,
        total_raised: u64,
        investor_count: u64,
        investors: VecMap<address, u64>,
        is_active: bool,
        is_funded: bool,
    }

    // Investment share NFT
    public struct InvestmentShare has key, store {
        id: UID,
        project_id: address,
        investor: address,
        amount: u64,
        share_percentage: u64, // Basis points (e.g., 1000 = 10%)
        timestamp: u64,
    }

    // Create a new investment project
    public fun create_project(
        name: vector<u8>,
        description: vector<u8>,
        target_amount: u64,
        min_investment: u64,
        ctx: &mut TxContext
    ) {
        use sui::balance;
        use sui::object;
        use sui::transfer;
        use sui::vec_map;
        use std::string;
        
        let project_uid = object::new(ctx);
        let project_id = object::uid_to_address(&project_uid);

        let project = InvestmentProject {
            id: project_uid,
            name: string::utf8(name),
            description: string::utf8(description),
            creator: ctx.sender(),
            target_amount,
            min_investment,
            balance: balance::zero(),
            total_raised: 0,
            investor_count: 0,
            investors: vec_map::empty(),
            is_active: true,
            is_funded: false,
        };

        event::emit(ProjectCreatedEvent {
            project_id,
            name: project.name,
            target_amount,
            min_investment,
        });

        transfer::share_object(project);
    }

    // Invest in a project
    public fun invest(
        project: &mut InvestmentProject,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        use sui::balance;
        use sui::object;
        use sui::transfer;
        use sui::vec_map;
        
        assert!(project.is_active, E_PROJECT_NOT_ACTIVE);
        
        let amount = coin::value(&payment);
        assert!(amount >= project.min_investment, E_BELOW_MIN_INVESTMENT);
        assert!(project.total_raised + amount <= project.target_amount, E_INVESTMENT_CAP_REACHED);

        let investor = ctx.sender();
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut project.balance, coin_balance);

        // Update investor records
        if (vec_map::contains(&project.investors, &investor)) {
            let existing_amount = vec_map::get_mut(&mut project.investors, &investor);
            *existing_amount = *existing_amount + amount;
        } else {
            vec_map::insert(&mut project.investors, investor, amount);
            project.investor_count = project.investor_count + 1;
        };

        project.total_raised = project.total_raised + amount;

        let project_id = object::uid_to_address(&project.id);
        let timestamp = ctx.epoch();

        // Calculate share percentage (in basis points)
        let share_percentage = (amount * 10000) / project.target_amount;

        event::emit(InvestmentEvent {
            project_id,
            investor,
            amount,
            timestamp,
        });

        // Mint investment share NFT
        let share = InvestmentShare {
            id: object::new(ctx),
            project_id,
            investor,
            amount,
            share_percentage,
            timestamp,
        };
        transfer::public_transfer(share, investor);

        // Check if project is fully funded
        if (project.total_raised >= project.target_amount) {
            project.is_funded = true;
            project.is_active = false;
            
            event::emit(ProjectFundedEvent {
                project_id,
                total_raised: project.total_raised,
                investor_count: project.investor_count,
            });
        };
    }

    // Creator withdraws funds (only when funded)
    public fun withdraw_funds(
        project: &mut InvestmentProject,
        amount: u64,
        ctx: &mut TxContext
    ) {
        use sui::balance;
        use sui::transfer;
        
        assert!(ctx.sender() == project.creator, E_UNAUTHORIZED);
        assert!(project.is_funded, E_PROJECT_NOT_ACTIVE);
        assert!(balance::value(&project.balance) >= amount, E_INSUFFICIENT_AMOUNT);

        let withdrawn = coin::take(&mut project.balance, amount, ctx);
        transfer::public_transfer(withdrawn, project.creator);
    }

    // Creator cancels project and refunds investors (only if not funded)
    public fun cancel_project(
        project: &mut InvestmentProject,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == project.creator, E_UNAUTHORIZED);
        assert!(!project.is_funded, E_PROJECT_NOT_ACTIVE);
        
        project.is_active = false;
    }

    // View functions
    public fun name(project: &InvestmentProject): &String {
        &project.name
    }

    public fun description(project: &InvestmentProject): &String {
        &project.description
    }

    public fun target_amount(project: &InvestmentProject): u64 {
        project.target_amount
    }

    public fun total_raised(project: &InvestmentProject): u64 {
        project.total_raised
    }

    public fun investor_count(project: &InvestmentProject): u64 {
        project.investor_count
    }

    public fun is_active(project: &InvestmentProject): bool {
        project.is_active
    }

    public fun is_funded(project: &InvestmentProject): bool {
        project.is_funded
    }

    public fun creator(project: &InvestmentProject): address {
        project.creator
    }
}
