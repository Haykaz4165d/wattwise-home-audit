import { generateResponse } from "@lovable.dev/ai-gateway";

const INSTRUCTIONS = `Դու օգնում ես 11-րդ դասարանի աշակերտներին պատրաստել նախագծային աշխատանքի պաշտպանության խոսքը։
Թեման՝ «Կենցաղային էլեկտրասարքերի էներգաարդյունավետության հետազոտություն»։
Գրիր ՄԵԿ սլայդի ներկայացման կարճ խոսք՝ հայերենով, աշակերտի բերանով (մենք/մեր թիմը), պարզ ու բնական, ինչպես բարձրաձայն են ասում դասարանում։
Կանոններ.
- 50–90 բառ, 3–5 նախադասություն, առանց վերնագրերի, ցուցակների և markdown-ի։
- Հիմնվիր ՄԻԱՅՆ սլայդի տեքստի վրա։ Թվեր, անուններ կամ փաստեր մի՛ հորինիր, օգտագործիր միայն սլայդում եղածները։
- Եթե սլայդում թիվը նշված է որպես օրինակ կամ ենթադրություն, այդպես էլ ասա։
- Բանաձևերը կարդա բառերով (օրինակ՝ «հզորությունը հավասար է լարման և հոսանքի ուժի արտադրյալին»)։`;

export async function writeSpeakerNotes(title: string, slideText: string): Promise<string> {
  const res = await generateResponse({
    model: "openai/gpt-6-astra",
    instructions: INSTRUCTIONS,
    input: `Սլայդի անվանումը՝ ${title}\n\nՍլայդի տեքստը՝\n${slideText}`,
  });
  const text = res.output
    .flatMap((item) => (item.type === "message" ? item.content : []))
    .map((c) => (c.type === "output_text" ? c.text : ""))
    .join("")
    .trim();
  if (!text) throw new Error("Empty speaker notes");
  return text;
}
