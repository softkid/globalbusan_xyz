// Simple Sui testnet donation counter contract
module donation::donation_pool {
    use std::error;
    use std::string;
    use std::option::{Self, Option};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    const E_ALREADY_INIT: u64 = 1;

    struct DonationCounter has key {
        total: u64,
        last_donor: Option<string::String>,
    }

    /// Publish once to create the shared counter object
    public entry fun init(ctx: &mut TxContext) {
        let counter = DonationCounter { total: 0, last_donor: option::none() };
        transfer::share_object(counter, ctx);
    }

    /// Record a donation amount (in smallest unit) and track the last donor address as string
    public entry fun donate(counter: &mut DonationCounter, amount: u64, donor: string::String, _ctx: &mut TxContext) {
        counter.total = counter.total + amount;
        counter.last_donor = option::some(donor);
    }

    public fun total(counter: &DonationCounter): u64 {
        counter.total
    }

    public fun last_donor(counter: &DonationCounter): &Option<string::String> {
        &counter.last_donor
    }
}
