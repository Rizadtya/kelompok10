import { StepShell, Card } from './StepShell';
import { Field, SearchableSelect, Select, TextArea, TextInput } from '../ui/fields';
import { useConfig } from '../../state/ConfigContext';
import {
  BODY_STYLES,
  CONDITIONS,
  POPULAR_MAKES,
  VEHICLE_TYPES,
} from '../../constants';

export function InfoStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, updateVehicle } = useConfig();
  const v = state.vehicle;

  const currentYear = new Date().getFullYear() + 1;
  const years = Array.from({ length: 75 }, (_, i) => String(currentYear - i));

  return (
    <StepShell
      title="Vehicle Information"
      description="Tell us about your vehicle. Searchable fields accept free text, so uncommon or rare vehicles are fully supported."
      onBack={onBack}
      onNext={onNext}
    >
      <Card title="Identity">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Make / Brand" required>
            <SearchableSelect
              value={v.make}
              onChange={(make) => updateVehicle({ make })}
              options={POPULAR_MAKES}
              placeholder="e.g. Toyota, or type any brand"
            />
          </Field>
          <Field label="Model" required>
            <TextInput
              value={v.model}
              onChange={(model) => updateVehicle({ model })}
              placeholder="e.g. GR86, M3, Civic Type R"
            />
          </Field>
          <Field label="Production Year">
            <SearchableSelect
              value={v.year}
              onChange={(year) => updateVehicle({ year })}
              options={years}
              placeholder="e.g. 2022"
            />
          </Field>
          <Field label="Condition">
            <Select
              value={v.condition}
              onChange={(condition) => updateVehicle({ condition })}
              options={CONDITIONS}
            />
          </Field>
        </div>
      </Card>

      <Card title="Form & Body">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Vehicle Type">
            <Select
              value={v.vehicleType}
              onChange={(vehicleType) => updateVehicle({ vehicleType })}
              options={VEHICLE_TYPES}
            />
          </Field>
          <Field label="Body Style">
            <SearchableSelect
              value={v.bodyStyle}
              onChange={(bodyStyle) => updateVehicle({ bodyStyle })}
              options={BODY_STYLES}
              placeholder="e.g. 2-door Coupe"
            />
          </Field>
        </div>
      </Card>

      <Card title="Current State">
        <div className="grid gap-5">
          <Field
            label="Current Modifications"
            hint="List anything already done — intake, exhaust, wheels, tint, etc."
          >
            <TextArea
              value={v.currentModifications}
              onChange={(currentModifications) => updateVehicle({ currentModifications })}
              placeholder="e.g. Catback exhaust, 18in wheels, 20% tint"
              rows={3}
            />
          </Field>
          <Field label="Engine / Performance Details" hint="Optional">
            <TextArea
              value={v.engineDetails}
              onChange={(engineDetails) => updateVehicle({ engineDetails })}
              placeholder="e.g. 2.4L NA, ~228 hp, 6-speed manual"
              rows={2}
            />
          </Field>
        </div>
      </Card>
    </StepShell>
  );
}
