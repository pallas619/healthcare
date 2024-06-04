// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Healthcare {
    struct Patient {
        address id;
        string name;
        uint age;
        string medicalHistory;
    }

    struct Doctor {
        address id;
        string name;
        string specialization;
    }

    address public admin;
    mapping(address => Patient) public patientRecords;
    mapping(address => Doctor) public doctors;
    mapping(address => bool) public authorizedDoctor;
    mapping(string => address[]) public doctorsBySpecialization;
    uint public doctorCount;

    event PatientRecordAdded(address id, string name);
    event PatientRecordUpdated(address id, string name);
    event DoctorAuthorized(address id, string name, string specialization);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedDoctor[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function authorizeDoctor(address _doctor, string memory _name, string memory _specialization) public onlyAdmin {
        require(!authorizedDoctor[_doctor], "Doctor is already authorized");
        doctors[_doctor] = Doctor(_doctor, _name, _specialization);
        authorizedDoctor[_doctor] = true;
        doctorsBySpecialization[_specialization].push(_doctor);
        doctorCount++;
        emit DoctorAuthorized(_doctor, _name, _specialization);
    }

    function addPatientRecord(address _id, string memory _name, uint _age, string memory _medicalHistory) public onlyAuthorized {
        require(patientRecords[_id].id == address(0), "Patient already exists");
        patientRecords[_id] = Patient(_id, _name, _age, _medicalHistory);
        emit PatientRecordAdded(_id, _name);
    }

    function updatePatientRecord(address _id, string memory _name, uint _age, string memory _medicalHistory) public onlyAuthorized {
        require(patientRecords[_id].id != address(0), "Patient does not exist");
        Patient storage patient = patientRecords[_id];
        patient.name = _name;
        patient.age = _age;
        patient.medicalHistory = _medicalHistory;
        emit PatientRecordUpdated(_id, _name);
    }

    function getPatientRecord(address _id) public view returns (Patient memory) {
        require(patientRecords[_id].id != address(0), "Patient does not exist");
        return patientRecords[_id];
    }

    function getDoctorsBySpecialization(string memory _specialization) public view returns (address[] memory) {
        return doctorsBySpecialization[_specialization];
    }
}
