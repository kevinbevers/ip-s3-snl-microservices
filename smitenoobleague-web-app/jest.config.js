module.exports = {
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    moduleNameMapper: {
      '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)\\?(resize|sizes)(.+)?$':
        '<rootDir>/__mocks__/fileResizeMock.js',
      '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?.+)?$': '<rootDir>/__mocks__/fileMock.js',
      '^.+\\.svg\\?(sprite|include)(.+)?$': '<rootDir>/__mocks__/svgMock.js',
      '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
    },
    roots: [
        "<rootDir>",
        "src"
      ],
      modulePaths: [
        "<rootDir>",
        "src"
      ],
      moduleDirectories: [
        "node_modules"
      ]
  }