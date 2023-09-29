// crate class Password and have hashing and verifying methods all by salt using crypto and export instance of it

import crypto from 'crypto';

class Password {
  private createSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  private createHash(password: string, salt: string) {
    return salt + '.' + crypto.scryptSync(password, salt, 64).toString('hex');
  }

  hash(password: string) {
    return this.createHash(password, this.createSalt());
  }

  verify(password: string, hash: string) {
    return this.createHash(password, hash.split('.')[0]) === hash;
  }
}

export const password = new Password();
