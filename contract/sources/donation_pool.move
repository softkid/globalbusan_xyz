// Global BUSAN donation pool contract for Sui blockchain
module globalbusan::donation_pool {
    use sui::balance::Balance;
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::object::UID;
    use sui::sui::SUI;
    use sui::tx_context::TxContext;
    use std::option::Option;
    use std::string::String;

    // Error codes
    const E_INSUFFICIENT_AMOUNT: u64 = 1;
    const E_POOL_NOT_ACTIVE: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;

    // Events
    public struct DonationEvent has copy, drop {
        donor: address,
        amount: u64,
        message: String,
        timestamp: u64,
    }

    public struct WithdrawalEvent has copy, drop {
        recipient: address,
        amount: u64,
        timestamp: u64,
    }

    // Main donation pool object
    public struct DonationPool has key {
        id: UID,
        balance: Balance<SUI>,
        total_donations: u64,
        donor_count: u64,
        last_donor: Option<address>,
        admin: address,
        is_active: bool,
    }

    // Donation receipt NFT
    public struct DonationReceipt has key, store {
        id: UID,
        donor: address,
        amount: u64,
        message: String,
        timestamp: u64,
    }

    // Initialize the donation pool (one-time setup)
    fun init(ctx: &mut TxContext) {
        use sui::balance;
        use sui::object;
        use sui::transfer;
        use std::option;
        
        let pool = DonationPool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_donations: 0,
            donor_count: 0,
            last_donor: option::none(),
            admin: ctx.sender(),
            is_active: true,
        };
        transfer::share_object(pool);
    }

    // Donate SUI to the pool
    public fun donate(
        pool: &mut DonationPool,
        payment: Coin<SUI>,
        message: vector<u8>,
        ctx: &mut TxContext
    ) {
        use sui::balance;
        use sui::object;
        use sui::transfer;
        use std::option;
        use std::string;
        
        assert!(pool.is_active, E_POOL_NOT_ACTIVE);
        
        let amount = coin::value(&payment);
        assert!(amount > 0, E_INSUFFICIENT_AMOUNT);

        let donor = ctx.sender();
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut pool.balance, coin_balance);

        pool.total_donations = pool.total_donations + amount;
        pool.donor_count = pool.donor_count + 1;
        pool.last_donor = option::some(donor);

        let msg_string = string::utf8(message);
        let timestamp = ctx.epoch();

        // Emit donation event
        event::emit(DonationEvent {
            donor,
            amount,
            message: msg_string,
            timestamp,
        });

        // Mint donation receipt NFT
        let receipt = DonationReceipt {
            id: object::new(ctx),
            donor,
            amount,
            message: msg_string,
            timestamp,
        };
        transfer::public_transfer(receipt, donor);
    }

    // Admin function to withdraw funds
    public fun withdraw(
        pool: &mut DonationPool,
        amount: u64,
        ctx: &mut TxContext
    ) {
        use sui::balance;
        use sui::transfer;
        
        assert!(ctx.sender() == pool.admin, E_UNAUTHORIZED);
        assert!(balance::value(&pool.balance) >= amount, E_INSUFFICIENT_AMOUNT);

        let withdrawn = coin::take(&mut pool.balance, amount, ctx);
        let recipient = ctx.sender();
        
        event::emit(WithdrawalEvent {
            recipient,
            amount,
            timestamp: ctx.epoch(),
        });

        transfer::public_transfer(withdrawn, recipient);
    }

    // Admin function to toggle pool status
    public fun set_active(
        pool: &mut DonationPool,
        active: bool,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == pool.admin, E_UNAUTHORIZED);
        pool.is_active = active;
    }

    // Admin function to transfer admin rights
    public fun transfer_admin(
        pool: &mut DonationPool,
        new_admin: address,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == pool.admin, E_UNAUTHORIZED);
        pool.admin = new_admin;
    }

    // View functions
    public fun total_donations(pool: &DonationPool): u64 {
        pool.total_donations
    }

    public fun donor_count(pool: &DonationPool): u64 {
        pool.donor_count
    }

    public fun current_balance(pool: &DonationPool): u64 {
        use sui::balance;
        balance::value(&pool.balance)
    }

    public fun is_active(pool: &DonationPool): bool {
        pool.is_active
    }

    public fun admin(pool: &DonationPool): address {
        pool.admin
    }

    public fun last_donor(pool: &DonationPool): &Option<address> {
        &pool.last_donor
    }
}
