/**
 * Głowny Interfejs Logger
 */
export abstract class LoggerService {

  /**
   * Logowanie komunikatu na poziomie ERROR
   * @param msg treść komunikatu
   */
  abstract error(msg: string): void;

  /**
   * Logowanie komunikatu na poziomie INFO
   * @param msg treść komunikatu
   */
  abstract info(msg: string): void;

  /**
   * Logowanie komunikatu na poziomie DEBUG
   * @param msg treść komunikatu
   */
  abstract debug(msg: string): void;
}

/**
 * Implementacja funkcji Loggera, które nic nie robią
 */
const doesNothing = () => {};

/**
 * Implementacja Loggera
 * Loguje wszystkie poziomy
 */
export class LoggerDebugService extends LoggerService {

  debug(msg: string): void {
    console.log(`[DEBUG] ${msg}`);
  }

  error(msg: string): void {
    console.error(msg);
  }

  info(msg: string): void {
    console.log(msg);
  }
}

/**
 * Implementacja Loggera
 * Pomija logowanie wpisów DEBUG
 */
export class LoggerInfoService extends LoggerService {

  debug = doesNothing;

  error(msg: string): void {
    console.error(msg);
  }

  info(msg: string): void {
    console.log(msg);
  }
}

/**
 * Implementacja Loggera
 * Pomija logowanie wpisów DEBUG i INFO
 */
export class LoggerErrorService extends LoggerService {

  debug = doesNothing;
  info = doesNothing;

  error(msg: string): void {
    console.error(msg);
  }
}
