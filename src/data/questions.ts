import { buildQuestion } from "@/data/buildQuestion";
import type { QuizQuestion } from "@/types/quiz";

const R1670 = "1670 (serial)";
const RHAL = "Halloween";
const RZOO = "Zwierzogród";

export const QUESTIONS: QuizQuestion[] = [
  buildQuestion(1, 1, R1670, 1, "W jakim stuleciu rozgrywa się akcja serialu „1670”?", "XVII wiek", ["XVI wiek", "XVIII wiek", "XIX wiek"], "Serial osadzony jest w XVII wieku.", "a"),
  buildQuestion(2, 1, R1670, 1, "Tytuł „1670” odnosi się do konkretnego:", "roku w historii Polski", ["numeru pułku", "nazwy zamku", "imienia bohatera"], "Rok 1670 — kontekst polsko-szwedzkich wydarzeń.", "c"),
  buildQuestion(3, 1, R1670, 1, "Serial „1670” to polska produkcja emitowana m.in. na:", "Netflix", ["HBO Max", "Disney+", "Amazon Prime"], "1670 trafił m.in. do katalogu Netflix.", "b"),
  buildQuestion(4, 1, R1670, 1, "Potop szwedzki w Rzeczypospolitej rozpoczął się w roku:", "1655", ["1670", "1683", "1648"], "Inwazja szwedzka — 1655 (tło epoki serialu).", "d"),
  buildQuestion(5, 1, R1670, 1, "Który król panował w Polsce w czasie potopu szwedzkiego?", "Jan Kazimierz", ["Jan III Sobieski", "Zygmunt III Waza", "August II Mocny"], "Jan Kazimierz — król w latach potopu.", "a"),
  buildQuestion(6, 1, R1670, 1, "Jan III Sobieski, bohater epoki, w 1670 pełnił m.in. funkcję:", "hetmana polnego", ["króla", "papieża", "burmistrza Gdańska"], "Przed koronacją Sobieski był hetmanem.", "c"),

  buildQuestion(7, 2, RHAL, 1, "Halloween obchodzi się tradycyjnie w nocy z 31 października na:", "1 listopada", ["30 października", "2 listopada", "11 listopada"], "Noc witches — koniec października.", "b"),
  buildQuestion(8, 2, RHAL, 1, "Tradycyjnie wycina się na Halloween:", "dynię", ["arbuz", "ananas", "kapustę"], "Jack-o'-lantern z dyni.", "a"),
  buildQuestion(9, 2, RHAL, 1, "Kostium na Halloween dzieci często uzupełniają frazą:", "Trick or treat", ["Happy Easter", "Merry Christmas", "Trick or meat"], "„Cukierek albo psikus”.", "d"),
  buildQuestion(10, 2, RHAL, 1, "Kolor mocno kojarzony z Halloween to:", "pomarańczowy", ["różowy", "złoty", "błękitny"], "Dynie i jesień — pomarańcz.", "c"),
  buildQuestion(11, 2, RHAL, 1, "Postać często przebierana na Halloween:", "wampir", ["mikołaj", "królik", "kowboj"], "Klasyka grozy — wampir.", "a"),
  buildQuestion(12, 2, RHAL, 1, "Święto Halloween wywodzi się m.in. z tradycji celtyckiej:", "Samhain", ["Walpurgis", "Imbolc", "Beltane"], "Samhain — koniec lata w kalendarzu celtyckim.", "b"),

  buildQuestion(13, 3, RZOO, 1, "Jak ma na imię królik-policejantka w „Zwierzogrodzie”?", "Judy Hopps", ["Nick Wilde", "Bellwether", "Clawhauser"], "Judy Hopps — główna bohaterka.", "a"),
  buildQuestion(14, 3, RZOO, 1, "Partner Judy to lis o imieniu:", "Nick Wilde", ["Robin Hood", "Flash", "Bogo"], "Nick Wilde — lis-konfer.", "c"),
  buildQuestion(15, 3, RZOO, 1, "Miasto, w którym rozgrywa się akcja filmu:", "Zootopia", ["Animalsburg", "Furry Town", "Beastville"], "Zootopia / Zwierzogród.", "b"),
  buildQuestion(16, 3, RZOO, 1, "Judy zaczyna pracę w:", "policji", ["szkole", "restauracji", "kawiarni"], "Marzenie — policjantka.", "d"),
  buildQuestion(17, 3, RZOO, 1, "Powolne zwierzę w urzędzie — słynna scena z:", "leniwcem (Flash)", [" żółwiem", "ślimakiem", "snem"], "Flash the sloth — urząd DMV.", "a"),
  buildQuestion(18, 3, RZOO, 1, "Antagonistka (owca) nazywa się:", "Bellwether", ["Mayor Lionheart", "Duke Weaselton", "Mr. Big"], "Assistant Mayor Bellwether.", "c"),
];

export const QUESTIONS_BY_ID = new Map(
  QUESTIONS.map((question) => [question.id, question]),
);
