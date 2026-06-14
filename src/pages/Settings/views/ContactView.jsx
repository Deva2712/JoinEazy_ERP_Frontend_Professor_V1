import React from "react";
import { Phone, MapPin } from "lucide-react";
import { cardClass, Field, Inp, SecHead, TopBar } from "../components/ProfilePrimitives";

const ContactView = ({ studentData, setStudentData, onSave, loading }) => {
    const set  = (k)         => (e) => setStudentData(prev => ({ ...prev, [k]: e.target.value }));
    const setN = (parent, k) => (e) => setStudentData(prev => ({ ...prev, [parent]: { ...prev[parent], [k]: e.target.value } }));

    const AddressBlock = ({ parentKey, label, color }) => (
        <section className={cardClass}>
            <SecHead icon={MapPin} label={label} color={color} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Address Line 1" span2><Inp value={studentData[parentKey].line1}  onChange={setN(parentKey,"line1")}  placeholder="House / Flat No, Street" /></Field>
                <Field label="Address Line 2" span2><Inp value={studentData[parentKey].line2}  onChange={setN(parentKey,"line2")}  placeholder="Area / Locality" /></Field>
                <Field label="City"><Inp   value={studentData[parentKey].city}    onChange={setN(parentKey,"city")}    /></Field>
                <Field label="State"><Inp  value={studentData[parentKey].state}   onChange={setN(parentKey,"state")}   /></Field>
                <Field label="PIN Code"><Inp value={studentData[parentKey].pin}   onChange={setN(parentKey,"pin")}     maxLength={6} /></Field>
                <Field label="Country"><Inp value={studentData[parentKey].country} onChange={setN(parentKey,"country")} /></Field>
            </div>
        </section>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Contact Details" onSave={onSave} loading={loading} />

            <section className={cardClass}>
                <SecHead icon={Phone} label="Contact Details" color="text-teal-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Mobile Number *"><Inp type="tel" value={studentData.mobileNumber}  onChange={set("mobileNumber")}  placeholder="+91 XXXXX XXXXX" /></Field>
                    <Field label="Alternate Mobile"><Inp type="tel" value={studentData.alternateMobile} onChange={set("alternateMobile")} /></Field>
                    <Field label="Official Email *"><Inp type="email" value={studentData.officialEmail} onChange={set("officialEmail")} /></Field>
                    <Field label="Personal Email"><Inp type="email" value={studentData.personalEmail}  onChange={set("personalEmail")} /></Field>
                </div>
            </section>

            <AddressBlock parentKey="permanentAddress" label="Permanent Address" color="text-teal-600" />

            <section className={cardClass}>
                <SecHead icon={MapPin} label="Current Address" color="text-cyan-600" />
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer mb-5">
                    <input type="checkbox" checked={studentData.sameAddress}
                        onChange={e => setStudentData(prev => ({ ...prev, sameAddress: e.target.checked }))}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600" />
                    Same as permanent address
                </label>
                {!studentData.sameAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Address Line 1" span2><Inp value={studentData.currentAddress.line1}  onChange={setN("currentAddress","line1")}  placeholder="House / Flat No, Street" /></Field>
                        <Field label="Address Line 2" span2><Inp value={studentData.currentAddress.line2}  onChange={setN("currentAddress","line2")}  placeholder="Area / Locality" /></Field>
                        <Field label="City"><Inp   value={studentData.currentAddress.city}    onChange={setN("currentAddress","city")}    /></Field>
                        <Field label="State"><Inp  value={studentData.currentAddress.state}   onChange={setN("currentAddress","state")}   /></Field>
                        <Field label="PIN Code"><Inp value={studentData.currentAddress.pin}   onChange={setN("currentAddress","pin")}     maxLength={6} /></Field>
                        <Field label="Country"><Inp value={studentData.currentAddress.country} onChange={setN("currentAddress","country")} /></Field>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ContactView;