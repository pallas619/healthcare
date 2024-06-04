const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Healthcare Contract", function () {
    let Healthcare;
    let healthcare;
    let admin;
    let doctor1;
    let doctor2;
    let patient1;
    const doctor1Name = "Dr. Smith";
    const doctor1Specialization = "Cardiology";
    const doctor2Name = "Dr. Johnson";
    const doctor2Specialization = "Neurology";
    const patient1Name = "Alice";
    const patient1Age = 30;
    const patient1MedicalHistory = "No known allergies";

    beforeEach(async function () {
        [admin, doctor1, doctor2, patient1] = await ethers.getSigners();
        Healthcare = await ethers.getContractFactory("Healthcare");
        healthcare = await Healthcare.deploy();
        await healthcare.deployed();
    });

    it("should allow admin to authorize doctors", async function () {
        await healthcare.authorizeDoctor(doctor1.address, doctor1Name, doctor1Specialization);
        const isAuthorized = await healthcare.authorizedDoctor(doctor1.address);
        expect(isAuthorized).to.be.true;

        const doctor = await healthcare.doctors(doctor1.address);
        expect(doctor.name).to.equal(doctor1Name);
        expect(doctor.specialization).to.equal(doctor1Specialization);
    });

    it("should allow authorized doctor to add patient record", async function () {
        await healthcare.authorizeDoctor(doctor1.address, doctor1Name, doctor1Specialization);
        await healthcare.connect(doctor1).addPatientRecord(patient1.address, patient1Name, patient1Age, patient1MedicalHistory);

        const patient = await healthcare.getPatientRecord(patient1.address);
        expect(patient.name).to.equal(patient1Name);
        expect(patient.age).to.equal(patient1Age);
        expect(patient.medicalHistory).to.equal(patient1MedicalHistory);
    });

    it("should allow authorized doctor to update patient record", async function () {
        await healthcare.authorizeDoctor(doctor1.address, doctor1Name, doctor1Specialization);
        await healthcare.connect(doctor1).addPatientRecord(patient1.address, patient1Name, patient1Age, patient1MedicalHistory);

        const updatedMedicalHistory = "Diabetic";
        await healthcare.connect(doctor1).updatePatientRecord(patient1.address, patient1Name, patient1Age, updatedMedicalHistory);

        const patient = await healthcare.getPatientRecord(patient1.address);
        expect(patient.medicalHistory).to.equal(updatedMedicalHistory);
    });

    it("should return correct doctor count", async function () {
        await healthcare.authorizeDoctor(doctor1.address, doctor1Name, doctor1Specialization);
        await healthcare.authorizeDoctor(doctor2.address, doctor2Name, doctor2Specialization);

        const count = await healthcare.doctorCount();
        expect(count).to.equal(2);
    });

    it("should return doctors by specialization", async function () {
        await healthcare.authorizeDoctor(doctor1.address, doctor1Name, doctor1Specialization);
        await healthcare.authorizeDoctor(doctor2.address, doctor2Name, doctor2Specialization);

        const cardiologists = await healthcare.getDoctorsBySpecialization(doctor1Specialization);
        expect(cardiologists).to.include(doctor1.address);

        const neurologists = await healthcare.getDoctorsBySpecialization(doctor2Specialization);
        expect(neurologists).to.include(doctor2.address);
    });
});
