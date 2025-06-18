import hashlib
import os

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    hash_bytes = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
    return f"{salt.hex()}:{hash_bytes.hex()}"

def verify_password(stored_hash: str, password: str) -> bool:
    try:
        salt_hex, hash_hex = stored_hash.split(":")
        salt = bytes.fromhex(salt_hex)
        hash_bytes = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
        return hash_bytes.hex() == hash_hex
    except Exception:
        return False
