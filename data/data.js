const projects = [

  {
    projectName: 'Dr Adeniran',
    projectCost: 250000,
    paidCost: 150000,
    balance: 100000,
    todo: false,
    inProgress: true,
    completed: false,
    Tasks: [
      {
        name: 'Tissue Processing',
        checked: true,
      },
      {
        name: 'Immunohistochemistry',
        checked: false,
      },
      {
        name: 'Photomicrography',
        checked: false,
      }
    ],
    users: [
      {
        name: "Anadu Victor",
        email: "anadu@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '002'
      },
      {
        name: "Emmanual Emeka",
        email: "emeka@example.com",
        role: 'Research Assistant',
        admin: true,
        _id: '003'
      },
    ],
    _id: "617a72c78",
    projectAdmin: {
      name: "Joy Iroegbu",
      email: "iroegbu@example.com",
      admin: true,
      role: 'Research Assistant',
      _id: '001'
    },
  },

  {
    projectName: 'Dr Omotosho',
    projectCost: 50000,
    paidCost: 10000,
    balance: 40000,
    todo: false,
    inProgress: true,
    completed: false,
    Tasks: [
      {
        name: 'Tissue Processing',
        checked: true,
      },
      {
        name: 'Immunohistochemistry',
        checked: true,
      },
      {
        name: 'Photomicrography',
        checked: false,
      },
      {
        name: 'Quantification',
        checked: false,
      }
    ],
    users: [
      {
        name: "Adelusi Hannah",
        email: "adelusi@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '004'
      },
      {
        name: "Aneke Vivian",
        email: "aneke@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '005'
      }
    ],
    _id: "c4081150716472c78",
    projectAdmin: {
      name: "Joy Iroegbu",
      email: "iroegbu@example.com",
      admin: true,
      role: 'Research Assistant',
      _id: '001'
    },
  },

  {
    projectName: 'Mr Jolayemi',
    projectCost: 25000,
    paidCost: 15000,
    balance: 10000,
    todo: true,
    inProgress: false,
    completed: false,
    Tasks: [
      {
        name: 'Tissue Processing',
        checked: false,
      },
      {
        name: 'Immunohistochemistry',
        checked: false,
      },
      {
        name: 'Photomicrography',
        checked: false,
      }
    ],
    users: [
      {
        name: "Joy Iroegbu",
        email: "iroegbu@example.com",
        admin: true,
        role: 'Research Assistant',
        _id: '001'
      },
      {
        name: "Anadu Victor",
        email: "anadu@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '002'
      },
    ],
    _id: "617a518c408118",
    projectAdmin: {
      name: "Emmanual Emeka",
      email: "emeka@example.com",
      role: 'Research Assistant',
      admin: true,
      _id: '003'
    },
  },

  // #completed
  {
    projectName: 'Dr kay',
    projectCost: 300000,
    paidCost: 150000,
    balance: 150000,
    todo: false,
    inProgress: false,
    completed: true,
    Tasks: [
      {
        name: 'Tissue Processing',
        checked: true,
      },
      {
        name: 'Immunohistochemistry',
        checked: true,
      },
      {
        name: 'Photomicrography',
        checked: true,
      },
      {
        name: 'Quantification',
        checked: true,
      }
    ],
    users: [
      {
        name: "Adelusi Hannah",
        email: "adelusi@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '004'
      },
      {
        name: "Aneke Vivian",
        email: "aneke@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '005'
      }
    ],
    _id: "6174081150716472c78",
    projectAdmin: {
      name: "Emmanual Emeka",
      email: "emeka@example.com",
      role: 'Research Assistant',
      admin: true,
      _id: '003'
    },
  },

  {
    projectName: 'Mr Jolayemi',
    projectCost: 20000,
    paidCost: 15000,
    balance: 5000,
    todo: false,
    inProgress: false,
    completed: true,
    Tasks: [
      {
        name: 'Tissue Processing',
        checked: true,
      },
      {
        name: 'Immunohistochemistry',
        checked: true,
      },
      {
        name: 'Photomicrography',
        checked: true,
      }
    ],
    users: [
      {
        name: "Joy Iroegbu",
        email: "iroegbu@example.com",
        admin: true,
        role: 'Research Assistant',
        _id: '001'
      },
      {
        name: "Anadu Victor",
        email: "anadu@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '002'
      },
      {
        name: "Adelusi Hannah",
        email: "adelusi@example.com",
        role: 'Graduate Intern',
        admin: false,
        _id: '004'
      },
    ],
    _id: "617a518c50716472c78",
    projectAdmin: {
      name: "Joy Iroegbu",
      email: "iroegbu@example.com",
      admin: true,
      role: 'Research Assistant',
      _id: '001'
    },
  },
];


const usersData = [
  {
    name: "Joy Iroegbu",
    email: "iroegbu@example.com",
    admin: true,
    role: 'Research Assistant',
    _id: '001'
  },
  {
    name: "Anadu Victor",
    email: "anadu@example.com",
    role: 'Graduate Intern',
    admin: false,
    _id: '002'
  },
  {
    name: "Emmanual Emeka",
    email: "emeka@example.com",
    role: 'Research Assistant',
    admin: true,
    _id: '003'
  },
  {
    name: "Adelusi Hannah",
    email: "adelusi@example.com",
    role: 'Graduate Intern',
    admin: false,
    _id: '004'
  },
  {
    name: "Aneke Vivian",
    email: "aneke@example.com",
    role: 'Graduate Intern',
    admin: false,
    _id: '005'
  }
];

module.exports = { projects, usersData };