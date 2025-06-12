// Custom error types for lottery history interface

export class LotteryHistoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LotteryHistoryError';
  }
}

export class NoHistoryFoundError extends LotteryHistoryError {
  constructor() {
    super('No lottery history records found');
  }
}

export class NetworkConnectionError extends LotteryHistoryError {
  constructor() {
    super('Unable to connect to blockchain network');
  }
}

export class ContractInteractionError extends LotteryHistoryError {
  constructor(details?: string) {
    super(`Contract interaction failed: ${details || 'Unknown error'}`);
  }
}

export class DataValidationError extends LotteryHistoryError {
  constructor(details: string) {
    super(`Data validation failed: ${details}`);
  }
}