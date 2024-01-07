import { Alert } from "react-native";

export default function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

let isAlertShown = false;

const showAlert = (title, text, btnText = "OK") => {
  if (!isAlertShown) {
    isAlertShown = true;
    Alert.alert(
      title, // Заголовок модального окна
      text, // Текст сообщения в модальном окне
      [
        {
          text: btnText, // Текст на кнопке
          onPress: () => {
            isAlertShown = false;
          },
        },
      ]
    );
  }
};

const addCurrencySymbol = (number, currencyName) => {
  switch (currencyName) {
    case "USD":
      return "$ " + number;
    case "ARS":
      return number + " $";
    case "RUB":
      return number + " ₽";
    case "BTC":
      return number + " ₿";
  }
};

const formatNumber = (number, currencyName, addSymbol = false) => {
  let formattedNumber = number;
  if (number === ""){
    formattedNumber = "0"
  } else if (currencyName && currencyName !== "BTC") {
    formattedNumber = parseFloat(number).toFixed(2);
  } else {
    formattedNumber = parseFloat(number).toFixed(6);
  }
  // Удаляем несущественные нули и, возможно, десятичную точку
  formattedNumber = formattedNumber
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.$/, "");

  // Форматируем целую часть, добавляя пробелы
  if (currencyName && currencyName !== "BTC") {
    formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  formattedNumber = formattedNumber.replace(/\.00$/, "");
  if (addSymbol) {
    formattedNumber = addCurrencySymbol(formattedNumber, currencyName);
  }
  return formattedNumber;
};

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль, если необходимо
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function formatDateShort(date) {
  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  let day = date.getDate();
  let monthIndex = date.getMonth();
  let formattedMonth = months[monthIndex];

  return `${day} ${formattedMonth}`;
}

function calculateTotalAmountExInItem(transactions, exinItemId, currency_name) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return transactions.reduce((sum, transaction) => {
    if (
      isTransactionInCurrentMonth(transaction, currentMonth, currentYear) &&
      transaction.exin_item_id === exinItemId
    ) {
      const amountFloat = parseFloat(
        transaction[`amount${currency_name}`] || transaction.amount
      );
      return sum + (isNaN(amountFloat) ? 0 : amountFloat);
    }
    return sum;
  }, 0);
}

function isTransactionInCurrentMonth(transaction, currentMonth, currentYear) {
  const transactionDate = new Date(transaction.date);
  return (
    transactionDate.getMonth() === currentMonth &&
    transactionDate.getFullYear() === currentYear
  );
}

function calculateTotalAmount(transactions, currency_name) {
  const totalAmount = transactions.reduce((sum, transaction) => {
    const amountKey = `amount${currency_name}1`;
    const amountFloat = parseFloat(transaction[amountKey] || 0);

    return sum + (isNaN(amountFloat) ? 0 : amountFloat);
  }, 0);

  return totalAmount;
}

const getRate = (cur1, cur2, symbols) => {
  const getSymbolRate = (symbolName) => {
    const symbol = symbols.find((s) => s.name === symbolName);
    return symbol ? symbol.rate : 1;
  };

  const rateMap = {
    "ARSUSD": () => 1 / getSymbolRate("USDTARS"),
    "ARSRUB": () => getSymbolRate("USDTRUB") * (1 / getSymbolRate("USDTARS")),
    "ARSBTC": () => 1 / getSymbolRate("BTCARS"),
    "USDARS": () => getSymbolRate("USDTARS"),
    "USDBTC": () => 1 / getSymbolRate("BTCUSDT"),
    "USDRUB": () => getSymbolRate("USDTRUB"),
    "BTCUSD": () => getSymbolRate("BTCUSDT"),
    "BTCRUB": () => getSymbolRate("BTCRUB"),
    "BTCARS": () => getSymbolRate("BTCARS"),
    "RUBUSD": () => 1 / getSymbolRate("USDTRUB"),
    "RUBARS": () => getSymbolRate("USDTARS") * (1 / getSymbolRate("USDTRUB")),
    "RUBBTC": () => 1 / getSymbolRate("BTCRUB"),
  };

  const key = cur1 + cur2;
  return formatNumber(rateMap[key] ? rateMap[key]() : 1);
};

export const prepareTrzs = (transactions, exInItems, wallets) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Группировка транзакций по doc_id
  const groupedTransactions = sortedTransactions.reduce((acc, trz) => {
    (acc[trz.doc_id] = acc[trz.doc_id] || []).push(trz);
    return acc;
  }, {});

  // Обработка каждой группы транзакций
  return Object.values(groupedTransactions).map((group) => {
    if (group.length === 1) {
      // Обработка обычной транзакции
      const trz = group[0];
      const wallet = wallets.find((w) => w.id === trz.wallet_id);
      const exInItem = exInItems.find((e) => e.id === trz.exin_item_id);

      return createTransactionStructure(trz, wallet, exInItem);
    } else {
      // Обработка обмена между кошельками
      let trz1 = group[1];
      let trz2 = group[0];
      if (group[0].amount < 0) {
        trz1 = group[0];
        trz2 = group[1];
      }
      const wallet1 = wallets.find((w) => w.id === trz1.wallet_id);
      const wallet2 = wallets.find((w) => w.id === trz2.wallet_id);

      return createExchangeTransactionStructure(trz1, trz2, wallet1, wallet2);
    }
  });
};

function createTransactionStructure(trz, wallet, exInItem) {
  return {
    wallet1: wallet,
    wallet2: null,
    exInItem,
    ...createAmountFields(trz, "1"),
    comment: trz.comment,
    date: trz.date,
    user_name: trz.user_name,
    doc_id: trz.doc_id,
  };
}

function createExchangeTransactionStructure(trz1, trz2, wallet1, wallet2) {
  return {
    wallet1,
    wallet2,
    exInItem: null,
    ...createAmountFields(trz1, "1"),
    ...createAmountFields(trz2, "2"),
    comment: trz1.comment,
    date: trz1.date,
    user_name: trz1.user_name,
    doc_id: trz1.doc_id,
  };
}

function createAmountFields(trz, suffix) {
  return {
    [`amount${suffix}`]: trz.amount,
    [`amountARS${suffix}`]: trz.amountARS,
    [`amountUSD${suffix}`]: trz.amountUSD,
    [`amountBTC${suffix}`]: trz.amountBTC,
    [`amountRUB${suffix}`]: trz.amountRUB,
  };
}

export function groupTransactionsByDay(preparedTrzs) {
  const groupedByDay = {};

  preparedTrzs.forEach((transaction) => {
    // Извлекаем дату из объекта транзакции
    const date = new Date(transaction.date);
    const dayKey = date.toISOString().split("T")[0]; // формат YYYY-MM-DD

    // Инициализация группы, если это первая транзакция в этот день
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }

    // Добавление транзакции в соответствующую группу
    groupedByDay[dayKey].push(transaction);
  });

  // Возвращаем массив массивов транзакций, сгруппированных по дням
  return Object.values(groupedByDay);
}

export {
  showAlert,
  formatNumber,
  formatDate,
  calculateTotalAmountExInItem,
  calculateTotalAmount,
  getRate,
};