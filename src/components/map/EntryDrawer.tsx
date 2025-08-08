import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface EntryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: Record<string, any> | null;
}

// Friendly labels for key fields
const LABELS: Record<string, string> = {
  Q1_Location_in_BC: "Location in BC",
  Q1_Experience_with_AI: "Experience with AI",
  Q3_AI_affecting_society_feeling: "Overall feeling about AI's impact",
  Q8_AI_helping_BC_community_text_OE: "How AI helps your BC community (text)",
  Q8_AI_helping_BC_community_text_OE_sentiment: "Q8 sentiment",
  Q13_AI_impact_worries_text_OE: "Worries about AI impact (text)",
  Q13_AI_impact_worries_text_OE_sentiment: "Q13 sentiment",
  Q16_Indigenous_communities_involvement_AI_text_OE: "Indigenous communities' involvement (text)",
  Q16_Indigenous_communities_involvement_AI_text_OE_sentiment: "Q16 sentiment",
  Q17_Advice_BC_Leaders_text_OE: "Advice to BC leaders (text)",
  Q17_Advice_BC_Leaders_text_OE_sentiment: "Q17 sentiment",
  Q14_Govt_role_in_managing_AI: "Government role in managing AI",
  Age: "Age",
  AgeRollup_Broad: "Age group",
  Gender: "Gender",
  Education: "Education",
  HH_Income_Fine_23: "Household income",
  Ethnicity_Roll_23: "Ethnicity",
  Vizmin_23: "Visible minority",
  HH_Comp_23: "Household composition",
  KidsinHH_23: "Kids in household",
  HH_Under18_23: "Under 18 in household",
  "Urban/ Rural": "Urban/Rural",
};

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-4">
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
  </section>
);

const renderField = (k: string, v: any) => (
  <div key={k}>
    <span className="font-medium text-foreground">{LABELS[k] ?? k}</span>
    <div className="mt-0.5 whitespace-pre-wrap">{String(v ?? "").trim() || "—"}</div>
  </div>
);

const pick = (row: Record<string, any>, keys: string[]) => keys.filter(k => row[k] != null && String(row[k]).trim() !== "");

const EntryDrawer: React.FC<EntryDrawerProps> = ({ open, onOpenChange, row }) => {
  const hasRow = !!row;

  // Derive sector selections
  const posSectors = hasRow ? Object.keys(row!).filter(k => k.startsWith("Q4A_") && row![k] && !k.endsWith("_OE") && !k.includes("sentiment")) : [];
  const negSectors = hasRow ? Object.keys(row!).filter(k => k.startsWith("Q4B_") && row![k] && !k.endsWith("_OE") && !k.includes("sentiment")) : [];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Full response details</DrawerTitle>
          <DrawerDescription>Human-friendly view of the selected participant's answers.</DrawerDescription>
        </DrawerHeader>
        <Separator />
        <ScrollArea className="px-4 py-4 h-[65vh]">
          {!hasRow ? (
            <div className="text-sm text-muted-foreground">No data available.</div>
          ) : (
            <div>
              <Section title="Basics">
                {pick(row!, ["Q1_Location_in_BC", "Q1_Experience_with_AI", "Q3_AI_affecting_society_feeling"]).map(k => renderField(k, row![k]))}
              </Section>

              <Section title="Open responses">
                {pick(row!, [
                  "Q8_AI_helping_BC_community_text_OE",
                  "Q8_AI_helping_BC_community_text_OE_sentiment",
                  "Q13_AI_impact_worries_text_OE",
                  "Q13_AI_impact_worries_text_OE_sentiment",
                  "Q16_Indigenous_communities_involvement_AI_text_OE",
                  "Q16_Indigenous_communities_involvement_AI_text_OE_sentiment",
                  "Q17_Advice_BC_Leaders_text_OE",
                  "Q17_Advice_BC_Leaders_text_OE_sentiment",
                ]).map(k => renderField(k, row![k]))}
              </Section>

              {(posSectors.length > 0 || negSectors.length > 0) && (
                <Section title="Sectors mentioned">
                  {posSectors.length > 0 && (
                    <div>
                      <span className="font-medium text-foreground">Positive impact:</span>
                      <div className="mt-0.5 text-muted-foreground">
                        {posSectors.map(k => (row![k] ? String(row![k]) : k.replace(/^Q4A_/, "")).trim()).join(", ")}
                      </div>
                    </div>
                  )}
                  {negSectors.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium text-foreground">Negative impact:</span>
                      <div className="mt-0.5 text-muted-foreground">
                        {negSectors.map(k => (row![k] ? String(row![k]) : k.replace(/^Q4B_/, "")).trim()).join(", ")}
                      </div>
                    </div>
                  )}
                </Section>
              )}

              <Section title="Views & priorities">
                {pick(row!, ["Q5_Art_vibe_AI", "Q6_AI_role_in_creative_fields_in_BC", "Q7_AI_and_environment", "Q9_Jobs_in_BC_AI_Influence", "Q14_Govt_role_in_managing_AI"]).map(k => renderField(k, row![k]))}
              </Section>

              <Section title="Demographics">
                {pick(row!, [
                  "Age","AgeRollup_Broad","Gender","Education","HH_Income_Fine_23","Ethnicity_Roll_23","Vizmin_23","HH_Comp_23","KidsinHH_23","HH_Under18_23","Urban/ Rural"
                ]).map(k => renderField(k, row![k]))}
              </Section>
            </div>
          )}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <button type="button" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EntryDrawer;
