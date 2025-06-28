export const config = {
  version: '1.0.0',
  appName: 'pet-appointment',
  api: {
    endpoint: {
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
      },
      user: {
        profile: '/users/profile',
        addUser: '/users/save',
        addSubject: '/users/save-subjects',
        removeAnimalTypes: '/users',
        getAllPets: '/users/pets-all',
        getAllWeightEdit: '/users/editpet/all-weight',
        editUser: '/users/update-user',
        removeUser: '/users/delete-user',
        removePet: '/users/delete-pet',
        editPet: '/users/edit-pet',
      },
      appointment: {
        getPets: '/users/pets',
        savePets: '/users/save-pets',
        getPrice: '/users/price',
        getAnimalType: '/users/animals-type',
        getWeigth: '/users/weight',
        getSubject: '/appoinment/subject',
        getPriceByWeight: '/users/price-by-weight',
        getTimeBtDate: '/users/times-by-date',
        createAppointment: '/appoinment/create',
        getAppointment: '/appoinment',
        getAllweight: '/users/all-weight',
        updateStatus: '/appoinment/status/',
      }
    },
  },
};
