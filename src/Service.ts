type DataUser = {
    name?: string;
    email: string;
    password: string;
};

export type DataUserCreateResponse = {
    id: string;
    email: string;
};

export type DataWord = {
    id: string;
    _id?: string;
    group: number;
    page: number;
    word: string;
    image: string;
    audio: string;
    audioMeaning: string;
    audioExample: string;
    textMeaning: string;
    textExample: string;
    transcription: string;
    wordTranslate: string;
    textMeaningTranslate: string;
    textExampleTranslate: string;
    userWord: {
        difficulty: string;
        optional: {
            guessedCount: string;
        };
    };
};

export type DataUserLoginResponse = {
    message: string;
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
};

export type DataUserWord = {
    userId: string;
    wordId: string;
};

export type DataCreateUserWordResponse = {
    id: string;
    difficulty: string;
    optional: {
        testFieldString: 'string';
        testFieldBoolean: boolean;
    };
    wordId: string;
};

export type DataAggregatedWords = {
    userId: string;
    group?: string;
    page?: string;
    wordsPerPage?: string;
    filter: string;
};

export type DataAggregatedWordsById = {
    userWord: {
        difficulty: string;
        optional: {
            guessedCount: string;
            notGuessedCount: string;
            inGame: boolean;
        };
    };
};
export type DataStat = {
    id?: string;
    learnedWords: number;
    optional: {
        newWordsAudioGame: number;
        newWordsSprintGame: number;
        wordsInRowAudioGame: number;
        wordsInRowSprintGame: number;
        totalQuestionsAudioGame: number;
        totalQuestionsSprintGame: number;
        totalCorrectAnswersAudioGame: number;
        totalCorrectAnswersSprintGame: number;
    };
};

export type DataAggregatedWordsResponse = {
    paginatedResults: DataWord[];
};

class Service {
    private static baseUrl = 'https://learn-english-words-app.herokuapp.com';

    public static async createUser(data: DataUser): Promise<DataUserCreateResponse | undefined> {
        try {
            const response = await fetch(`${this.baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(data),
            });
            const userData: DataUserCreateResponse = await response.json();
            return userData;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async loginUser(user: DataUser): Promise<DataUserLoginResponse | undefined> {
        try {
            const rawResponse = await fetch(`${this.baseUrl}/signin`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const loginResponse = await rawResponse.json();
            return loginResponse;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async getWords(group: number, page: number): Promise<DataWord[] | undefined> {
        try {
            const rawResponse = await fetch(`${this.baseUrl}/words?group=${group}&page=${page}`);
            const words: DataWord[] = await rawResponse.json();
            return words;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async createUserWord(
        wordData: DataUserWord,
        token: string,
        word: object
    ): Promise<DataCreateUserWordResponse | number | undefined> {
        const { userId, wordId } = wordData;
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/words/${wordId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(word),
            });
            if (rawResponse.status === 401) {
                return rawResponse.status;
            }

            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async updateUserWord(
        wordData: DataUserWord,
        token: string,
        word: object
    ): Promise<DataCreateUserWordResponse | number | undefined> {
        const { userId, wordId } = wordData;
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/words/${wordId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(word),
            });
            if (rawResponse.status === 401) {
                return rawResponse.status;
            }

            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async getUserWords(
        word: DataUserWord,
        token: string
    ): Promise<DataCreateUserWordResponse[] | number | undefined> {
        const { userId } = word;
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/words`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            if (rawResponse.status === 401) {
                return rawResponse.status;
            }
            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async deleteUserWord(word: DataUserWord, token: string): Promise<number | undefined> {
        const { userId, wordId } = word;
        try {
            const rawResponse = await fetch(
                `${this.baseUrl}/users/${userId}/words/${wordId}`,

                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            return rawResponse.status;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async aggregatedWords(
        word: DataAggregatedWords,
        token: string
    ): Promise<DataWord[] | number | undefined> {
        const { userId, group, page, wordsPerPage, filter } = word;
        try {
            const rawResponse = await fetch(
                `${this.baseUrl}/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            if (rawResponse.status === 401) {
                return rawResponse.status;
            }
            const content: DataAggregatedWordsResponse[] = await rawResponse.json();
            return content[0].paginatedResults;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async aggregatedWordsById(
        word: DataUserWord,
        token: string
    ): Promise<DataAggregatedWordsById[] | number | undefined> {
        const { userId, wordId } = word;
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/aggregatedWords/${wordId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            if (rawResponse.status === 401) {
                return rawResponse.status;
            }
            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async getUserStat(userId: string, token: string): Promise<DataStat | number | undefined> {
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/statistics`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            if (rawResponse.status === 401 || rawResponse.status === 404) {
                return rawResponse.status;
            }
            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }

    public static async updateUserStat(
        statData: DataStat,
        userId: string,
        token: string
    ): Promise<DataStat | number | undefined> {
        try {
            const rawResponse = await fetch(`${this.baseUrl}/users/${userId}/statistics`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(statData),
            });
            if (rawResponse.status === 401) {
                return rawResponse.status;
            }
            const content = await rawResponse.json();
            return content;
        } catch (error) {
            console.log(error);
        }
        return undefined;
    }
}

export default Service;
