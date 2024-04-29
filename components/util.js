import { Alert } from "react-native";
import { setIsLoading } from "./actions";
import * as SecureStore from "expo-secure-store";
import FormData from "form-data";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { AndroidOutputFormat, IOSAudioQuality } from "expo-av/build/Audio";

function daysBetween(dateString) {
  const oneDay = 1000 * 60 * 60 * 24; // Количество миллисекунд в одном дне

  const dateProvided = new Date(dateString);
  const currentDate = new Date();

  // Обрезаем время, оставляя только дату
  const dateWithoutTime = new Date(
    dateProvided.getFullYear(),
    dateProvided.getMonth(),
    dateProvided.getDate()
  );
  const currentWithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  // Вычисление разницы в днях
  const diffInTime = currentWithoutTime.getTime() - dateWithoutTime.getTime();
  const diffInDays = Math.floor(diffInTime / oneDay);

  return diffInDays;
}

export function isEmpty(value) {
  // Проверка на null и undefined
  if (value == null) {
    return true;
  }

  // Проверка на пустой объект
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }

  // Проверка на пустой массив или пустую строку
  if (Array.isArray(value) || typeof value === "string") {
    return value.length === 0;
  }

  // Для всех остальных типов данных возвращаем false
  return false;
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

const roundNumber = (number, currencyName) => {
  try {
    if (currencyName && (currencyName === "BTC" || currencyName === "ETH")) {
      return parseFloat(number.toFixed(6));
    } else {
      return parseFloat(number.toFixed(2));
    }
  } catch {
    return number;
  }
};

export const addCurrencySymbol = (expression, currencyName) => {
  // let _expression = roundNumber(expression)
  let _expression = expression;
  switch (currencyName) {
    case "USD":
      return `$ ${_expression}`;
    case "ARS":
      return `${_expression} $`;
    case "RUB":
      return `${_expression} ₽`;
    case "BTC":
      return `${_expression} ₿`;
    case "ETH":
      return `${_expression} ♢`;
    default:
      return _expression;
  }
};

export const formatNumberLight = (number) => {
  let formattedNumber = number;

  if (number === "") {
    formattedNumber = "0";
  } else if (number >= 1) {
    formattedNumber = parseFloat(number).toFixed(2);
  } else {
    formattedNumber = parseFloat(number).toFixed(4);
  }
  // Удаляем несущественные нули и, возможно, десятичную точку
  formattedNumber = formattedNumber
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.$/, "");

  // Форматируем целую часть, добавляя пробелы
  if (formatNumber > 999) {
    formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  formattedNumber = formattedNumber.replace(/\.00$/, "");
  return formattedNumber;
};

const formatNumber = (number, currencyName, addSymbol = true) => {
  let formattedNumber = number;
  if (number === "") {
    formattedNumber = "0";
  } else if (currencyName && currencyName !== "BTC" && currencyName !== "ETH") {
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
      transaction.exInItem.id === exinItemId
    ) {
      const amountFloat = parseFloat(
        transaction[`amount${currency_name}1`] || transaction.amount1
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

    if (isEmpty(transaction.wallet2)) {
      return sum + (isNaN(amountFloat) ? 0 : amountFloat);
    } else {
      return sum;
    }
  }, 0);

  return totalAmount;
}

const getRate = (cur1, cur2, symbols) => {
  const getSymbolRate = (symbolName) => {
    const symbol = symbols.find((s) => s.name === symbolName);
    return symbol ? symbol.rate : 1;
  };

  const rateMap = {
    ARSUSD: () => 1 / getSymbolRate("USDTARS"),
    ARSRUB: () => getSymbolRate("USDTRUB") * (1 / getSymbolRate("USDTARS")),
    ARSBTC: () => 1 / getSymbolRate("BTCARS"),
    ARSETH: () => 1 / getSymbolRate("BTCARS") / getSymbolRate("ETHBTC"),

    USDARS: () => getSymbolRate("USDTARS"),
    USDBTC: () => 1 / getSymbolRate("BTCUSDT"),
    USDRUB: () => getSymbolRate("USDTRUB"),
    USDETH: () => 1 / getSymbolRate("ETHUSDT"),

    BTCUSD: () => getSymbolRate("BTCUSDT"),
    BTCRUB: () => getSymbolRate("BTCRUB"),
    BTCARS: () => getSymbolRate("BTCARS"),
    BTCETH: () => 1 / getSymbolRate("ETHBTC"),

    RUBUSD: () => 1 / getSymbolRate("USDTRUB"),
    RUBARS: () => getSymbolRate("USDTARS") * (1 / getSymbolRate("USDTRUB")),
    RUBBTC: () => 1 / getSymbolRate("BTCRUB"),
    RUBETH: () => 1 / getSymbolRate("BTCRUB") / getSymbolRate("ETHBTC"),

    ETHUSD: () => getSymbolRate("ETHUSDT"),
    ETHRUB: () => getSymbolRate("ETHBTC") * getSymbolRate("BTCRUB"),
    ETHARS: () => getSymbolRate("ETHBTC") * getSymbolRate("BTCARS"),
    ETHBTC: () => getSymbolRate("ETHBTC"),
  };

  const key = cur1 + cur2;
  return rateMap[key] ? rateMap[key]() : 1;
};

export const prepareTrzs = (transactions, exInItems, wallets, users) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Группировка транзакций по doc_id
  const groupedTransactions = sortedTransactions.reduce((acc, trz) => {
    (acc[trz.doc_id] = acc[trz.doc_id] || []).push(trz);
    return acc;
  }, {});

  // console.log(transactions.find(i => i.doc_id = "786a20b2-349a-4eb1-8c5e-5c48e340f31b"))

  // Обработка каждой группы транзакций
  return Object.values(groupedTransactions).map((group) => {
    if (group.length === 1) {
      // Обработка обычной транзакции
      const trz = group[0];
      const wallet = wallets.find((w) => w.id === trz.wallet_id);
      const exInItem = exInItems.find((e) => e.id === trz.exin_item_id);
      const user = users.find((u) => u.id === trz.user_id);

      return createTransactionStructure(trz, wallet, exInItem, user);
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
      const user = users.find((u) => u.id === trz1.user_id);

      return createExchangeTransactionStructure(
        trz1,
        trz2,
        wallet1,
        wallet2,
        user
      );
    }
  });
};

function createTransactionStructure(trz, wallet, exInItem, user) {
  return {
    wallet1: wallet,
    wallet2: null,
    exInItem,
    ...createAmountFields(trz, "1"),
    comment: trz.comment,
    date: trz.date,
    user: user,
    doc_id: trz.doc_id,
    new: false,
    medified: false,
    deleted: false,
  };
}

function createExchangeTransactionStructure(
  trz1,
  trz2,
  wallet1,
  wallet2,
  user
) {
  return {
    wallet1,
    wallet2,
    exInItem: null,
    ...createAmountFields(trz1, "1"),
    ...createAmountFields(trz2, "2"),
    comment: trz1.comment,
    date: trz1.date,
    user: user,
    doc_id: trz1.doc_id,
    new: false,
    medified: false,
    deleted: false,
  };
}

function createAmountFields(trz, suffix) {
  return {
    [`amount${suffix}`]: trz.amount,
    [`amountARS${suffix}`]: trz.amountARS,
    [`amountUSD${suffix}`]: trz.amountUSD,
    [`amountBTC${suffix}`]: trz.amountBTC,
    [`amountETH${suffix}`]: trz.amountETH,
    [`amountRUB${suffix}`]: trz.amountRUB,
  };
}

export function groupTransactionsByDay(preparedTrzs) {
  const trzs = preparedTrzs.sort((a, b) => {
    let dateA = new Date(a.date);
    let dateB = new Date(b.date);
    return dateB - dateA;
  });
  const groupedByDay = {};

  trzs.forEach((transaction) => {
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

async function startRecording() {
  try {
    // Проверка разрешения на запись
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status === "granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const RECORDING_OPTIONS_PRESET_LOW_QUALITY = {
        isMeteringEnabled: true,
        android: {
          extension: ".mp4",
          outputFormat: AndroidOutputFormat.MPEG_4,
          audioEncoder: AndroidOutputFormat.AMR_NB,
          sampleRate: 16000, // Set to 16000 for 16 kHz sample rate
          numberOfChannels: 1, // Set to 1 for mono channel
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: IOSAudioQuality.LOW,
          sampleRate: 16000, // Set to 16000 for 16 kHz sample rate
          numberOfChannels: 1, // Set to 1 for mono channel
          linearPCMBitDepth: 16, // Set to 16 for 16-bit audio
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };
      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS_PRESET_LOW_QUALITY
      );
      return recording;
    } else {
      // Обработка случая отказа в разрешении
      console.error("Permission to access microphone was denied");
    }
  } catch (err) {
    console.error("Failed to start recording", err);
  }
}

async function stopRecording(dispatch, recording, lang = null) {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  const result = await sendAudioToServer(dispatch, uri, lang);
  return result;
}

async function sendAudioToServer(dispatch, uri) {
  dispatch(setIsLoading(true));
  const OPENAI_API_KEY = await SecureStore.getItemAsync("OPENAI_API_KEY");
  const filetype = uri.split(".").pop();
  const filename = uri.split("/").pop();
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: `audio/${filetype}`,
    name: filename,
  });
  formData.append("model", "whisper-1");
  formData.append("language", "ru");
  formData.append("prompt", "Каррифур 25000б овощной 5000, хлеб 1500.");

  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );
    const data = await response.json();

    try {
      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.error("Error deleting temporary audio file:", error);
    }

    dispatch(setIsLoading(false));
    return data.text;
  } catch (error) {
    console.error("Error sending audio to server:", error);
  }
}

const fetchRequest = async (dispatch, payload) => {
  dispatch(setIsLoading(true));
  const OPENAI_API_KEY = await SecureStore.getItemAsync("OPENAI_API_KEY");
  try {
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    };

    let url = "https://api.openai.com/v1/chat/completions";

    let params = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, params);
    const data = await response.json();

    if (response.status === 401) {
      throw new Error("Ошибка авторизации");
    } else if (response.status !== 200) {
      throw new Error(
        JSON.stringify({ data, status_code: response.status }, null, 2)
      );
    }
    dispatch(setIsLoading(false));
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

const GPTTransactions = async (dispatch, text) => {
  let system = `Товоя задача составить список покупок, для записи в базу данных.
Правила и некоторые понятия для выбора статьи расходов:
1. Сигареты, алкоголь, сладости, фастфуд, экскурсии относить к развлечениям.
2. Расходы, связанные с оплатой коммунальных услуг, аренды и ремонтов в кваритре относить к ЖКУ.
3. Расходы связанные с приобретением различных инструментов, посуды, мебели и прочих бытовых вещей относи к хоз. нуждам.
4. SUBE (субе) - это транспортная карта в Аргентине.
5. Могут использоваться различные аргентинские названия вещей и продуктов, таких, как "palta", "frutilla", и т.д.
6. Если статья расходов не очевидна, то нужно указать "Прочее". 

Не делай предположений о том, какие значения включать в функции. Попросите разъяснений, если запрос пользователя неоднозначен.`;

  const tools = [
    {
      type: "function",
      function: {
        name: "get_transactions_items",
        parameters: {
          type: "object",
          properties: {
            transactions: {
              type: "array",
              description: "Массив транзакций расхода",
              items: {
                type: "object",
                description: "Транзакция расхода",
                properties: {
                  expense_item: {
                    type: "string",
                    enum: [
                      "Продукты",
                      "Транспорт",
                      "Здоровье",
                      "Развлечения",
                      "ЖКУ",
                      "Хоз. нужды",
                      "Одежда",
                      "Налоги",
                      "Корректировка",
                      "Прочее",
                    ],
                    description: "Статья расходов",
                  },
                  summ: {
                    type: "number",
                    description: "Сумма расходов. Не может быть пустой.",
                  },
                  comment: {
                    type: "string",
                    description:
                      "Короткий комментарий - описание или название того, что было куплено.",
                  },
                  wallet: {
                    type: "string",
                    enum: [
                      "Galicia Sergei",
                      "USD cash",
                      "Belo card",
                      "ARS cash",
                    ],
                    description: "Кошелек транзакции",
                  },
                },
                required: ["expense_item", "summ", "comment"],
              },
            },
          },
          required: [],
        },
        description:
          "Получение списка транзакций, для записи расходов по статьям.",
      },
    },
  ];
  const payload = {
    model: "gpt-3.5-turbo-0125",
    messages: [
      { role: "system", content: system },
      { role: "user", content: text },
    ],
    tools: tools,
    tool_choice: "auto",
  };
  // console.log("payload", payload);
  let result;
  try {
    let response = await fetchRequest(dispatch, payload);
    // console.log("response", response)
    response = response.choices[0].message.tool_calls[0].function.arguments;
    // console.log("message", response)
    result = JSON.parse(response).transactions;
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

export {
  showAlert,
  formatNumber,
  formatDate,
  calculateTotalAmountExInItem,
  calculateTotalAmount,
  getRate,
  daysBetween,
  startRecording,
  stopRecording,
  fetchRequest,
  GPTTransactions,
};
