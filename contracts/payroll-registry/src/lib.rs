#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Bytes, Env};

#[contracttype]
pub enum DataKey {
    PayrollHash(u32),
}

#[contract]
pub struct PayrollRegistry;

#[contractimpl]
impl PayrollRegistry {
    /// Record a merkle root of a payroll run. Stores no PII.
    pub fn record(env: Env, recorder: Address, payroll_id: u32, merkle_root: Bytes) {
        recorder.require_auth();
        env.storage().persistent().set(&DataKey::PayrollHash(payroll_id), &merkle_root);
    }

    pub fn get(env: Env, payroll_id: u32) -> Option<Bytes> {
        env.storage().persistent().get(&DataKey::PayrollHash(payroll_id))
    }
}
