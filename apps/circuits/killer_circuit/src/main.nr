use dep::std;
// use dep::ecrecover;

// Max 10 members per game
global LEVELS: Field = 10;

// wrappers around poseidon hash equivalent to the circom implementation
fn hash_1(input: Field) -> Field {
    std::hash::poseidon::bn254::hash_1([input])
}
fn hash_2(input: [Field; 2]) -> Field {
    std::hash::poseidon::bn254::hash_2(input)
}

// same as stds::merkle::compute_merkle_root but using poseidon hash
fn compute_merkle_root(leaf: Field, index: Field, hash_path: [Field; LEVELS]) -> Field {
    let index_bits = index.to_le_bits(LEVELS as u32);
    let mut current = leaf;
    for i in 0..(LEVELS as u32) {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };

        current = hash_2([hash_left, hash_right]);
    }
    current
}

fn verify_killer(
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    hashed_message: [u8; 32],
    id_commitment: Field,
    killer_id: Field,
    external_nullifier: Field
) {
    // TODO: Fix ecrecover error
    // let key = ecrecover::secp256k1::PubKey::from_xy(pub_key_x, pub_key_y);
    // assert(key.verify_sig(signature, hashed_message));
    // verify if the player is the killer
    assert(killer_id == hash_2([external_nullifier, id_commitment]));
}

fn main(
    id_nullifier: Field,
    id_trapdoor: Field,
    siblings: [Field; LEVELS],
    indices: Field,
    root: pub Field,
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    hashed_message: [u8; 32],
    killer_id: pub Field,
    external_nullifier: pub Field
) {
    // reconstruct the commitment from the private nullfiers
    let secret = hash_2([id_nullifier, id_trapdoor]);
    let id_commitment = hash_1(secret);

    // compute the root of the merkle tree given the provided merkle merkle path
    // and the reconstructed id commitment to verify if player is part of game
    // this can later be verified against a trusted root onchain or offchain
    assert(root == compute_merkle_root(id_commitment, indices, siblings));

    verify_killer(
        pub_key_x,
        pub_key_y,
        signature,
        hashed_message,
        id_commitment,
        killer_id,
        external_nullifier
    );
}

#[test]
fn test_constraints() {
    let id_nullifier = 0x1f1b5eaf4668f989ad73aaeb663fcc0efc59690fec152c467811968f3b7e62a7;
    let id_trapdoor = 0x19922bd8da917b7552dbb8342db69e9f2de6e4ed9f966a217048c482ee1ab2a5;
    let indices = 0x0000000000000000000000000000000000000000000000000000000000000000;
    let siblings = [
        0x00b10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0c,
        0x26c4cf116e4541528a7decd7e6050e7addcef729f20dc2c1c8c6b530d9b44e1d,
        0x03444f524f400dd503947e460be294775f1b70130340685061dabc47cd3d811f,
        0x24fa39f0f3dacdc292d7a46a4f805f525b05ee186cc6100503056d3c84c839f5,
        0x18b71c32903c869168e4f26ea40b7ab6f040c8c0d2665de448b7f4feec294431,
        0x0542079ed5d42d6d47a509b02e7d5558ae7b8b3d0ca116ec5f60dfbb60b49d66,
        0x091cedbb9bd9ff409e63ac5904260a977f0b7ba98f608becac17891ea3d9f999,
        0x22449666a6f50384894ffe8ea69d65595e0741953d2a7032a42874ae0b4c0a8c,
        0x284f16b0db8334352c2125b2d8ab318ccb18ef9012ef1467fdc112f7e331daec,
        0x04fb5051d69026a32821a66b79d6ddd52f4e684d3c30d135a6a83b8648ce95fe
    ];
    let secret = hash_2([id_nullifier, id_trapdoor]);
    let id_commitment = hash_1(secret);
    let external_nullifier = 0x0000000000000000000000000000000000000000000000000000000000000001;
    let root = 0x104464380da04c760f9ddaa5828f13829d3d059ddd7e8d79df7d0a7c4d8db93d;
    let killer_id = 0x1096ae72fab1f88c5a039d8fa5ee595b27311b63ccd6f70d98e897587cd21fd4;

    assert(root == compute_merkle_root(id_commitment, indices, siblings));

    assert(killer_id == hash_2([external_nullifier, id_commitment]));
}
