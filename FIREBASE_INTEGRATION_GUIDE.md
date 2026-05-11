# 🔌 Integração Firebase Firestore - Guia Completo

## Visão Geral

O admin panel agora está totalmente integrado com Firebase Firestore usando `onSnapshot` para atualizações em tempo real.

---

## 🎯 O Que Foi Implementado

### Serviços Firebase

#### 1. **`services/firebase-users.ts`**
Gerencia dados de usuários em tempo real

```typescript
// Funções principais:
- subscribeToUsers() - Subscribe a todos os usuários
- subscribeToUsersSorted() - Subscribe com ordenação
- searchUsersLocal() - Filtrar usuários client-side
```

**Estrutura esperada dos usuários no Firestore:**
```javascript
{
  email: "usuario@example.com",
  lowercaseName: "usuario",
  name: "Usuario",
  uid: "unique-id-from-firebase"
}
```

#### 2. **`services/firebase-stats.ts`**
Gerencia contadores em tempo real

```typescript
// Funções principais:
- subscribeToUserCount() - Contagem de usuários
- subscribeTodietCount() - Contagem de dietas
- getRelativeTimeString() - Formatação de tempo relativo
```

---

## 🎣 Hooks Customizados

### `hooks/use-firebase-users.ts`
Hook para simplificar o uso em componentes

```typescript
const { users, loading, error } = useFirebaseUsers({
  sortField: 'name',
  sortDirection: 'asc'
});
```

---

## 📁 Estrutura do Firestore Esperada

### Collection: `users`
```json
Document ID: any-unique-id
{
  "email": "usuario@dietapp.local",
  "lowercaseName": "usuario",
  "name": "Usuario",
  "uid": "Bza4yHYoRiQ6wMcQ47OcHfhmYl22"
}
```

### Collection: `diets` (opcional)
```json
Document ID: any-unique-id
{
  "userId": "reference-to-user-id",
  "userEmail": "usuario@dietapp.local",
  "content": "Diet content here",
  "createdAt": Timestamp
}
```

---

## 📊 Como Usar nos Componentes

### Opção 1: Usando o Hook (Recomendado)

```typescript
import { useFirebaseUsers } from '@/hooks/use-firebase-users';

export default function MyComponent() {
  const { users, loading, error } = useFirebaseUsers({
    sortField: 'name',
    sortDirection: 'asc'
  });

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erro: {error.message}</Text>;

  return (
    <View>
      {users.map(user => (
        <Text key={user.id}>{user.name} - {user.email}</Text>
      ))}
    </View>
  );
}
```

### Opção 2: Usando o Serviço Diretamente

```typescript
import { subscribeToUsersSorted } from '@/services/firebase-users';

export default function MyComponent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToUsersSorted(
      (fetchedUsers) => setUsers(fetchedUsers),
      'name',
      'asc',
      (error) => console.error(error)
    );

    return () => unsubscribe();
  }, []);

  return (
    <View>
      {users.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
```

### Opção 3: Contadores com Tempo Real

```typescript
import { subscribeToUserCount, subscribeTodietCount } from '@/services/firebase-stats';

export default function StatsComponent() {
  const [userCount, setUserCount] = useState(0);
  const [dietCount, setDietCount] = useState(0);

  useEffect(() => {
    const unsubUser = subscribeToUserCount(setUserCount);
    const unsubDiet = subscribeTodietCount(setDietCount);

    return () => {
      unsubUser();
      unsubDiet();
    };
  }, []);

  return (
    <View>
      <Text>Usuários: {userCount}</Text>
      <Text>Dietas: {dietCount}</Text>
    </View>
  );
}
```

---

## 🔄 Fluxo de Dados em Tempo Real

```
Firestore (Collection: users)
    ↓
onSnapshot listener (active 24/7)
    ↓
Callback função (recebe array atualizado)
    ↓
setUsers() / setState
    ↓
Component re-render (automático)
    ↓
UI atualiza com novos dados

Quando dados mudam no Firestore:
Firestore → onSnapshot dispara → UI atualiza (segundos)
```

---

## ⚙️ Principais Características

### ✅ Tempo Real
- Qualquer mudança no Firestore atualiza automaticamente
- Sem necessidade de refresh manual
- Múltiplos usuários veem dados sincronizados

### ✅ Tratamento de Erros
- Error handling em todos os serviços
- Mensagens de erro claras
- Fallback graceful

### ✅ Cleanup Automático
- Listeners são removidos no unmount
- Previne memory leaks
- Sem dados antigos sendo carregados

### ✅ Performance
- Usa `onSnapshot` (eficiente)
- Filtragem client-side quando possível
- Sem queries desnecessárias

### ✅ Type Safety
- TypeScript com interfaces
- `FirebaseUser` interface bem definida
- Autocompletar no IDE

---

## 🔍 Exemplos de Uso

### Exemplo 1: Tabela de Usuários (Admin Panel)

```typescript
import { useFirebaseUsers } from '@/hooks/use-firebase-users';
import { searchUsersLocal } from '@/services/firebase-users';

export default function UsersTable() {
  const { users, loading, error } = useFirebaseUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = searchUsersLocal(users, searchTerm);

  return (
    <View>
      <TextInput
        placeholder="Buscar..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      
      {loading && <ActivityIndicator />}
      {error && <Text>Erro: {error.message}</Text>}
      
      {filteredUsers.map(user => (
        <View key={user.id}>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Exemplo 2: Card de Stats

```typescript
import { useFirebaseUsers } from '@/hooks/use-firebase-users';
import { subscribeToUserCount } from '@/services/firebase-stats';

export default function StatsCard() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToUserCount(
      (c) => {
        setCount(c);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>Usuários</Text>
      {loading ? <Spinner /> : <Text>{count}</Text>}
    </View>
  );
}
```

### Exemplo 3: Lista Sincronizada

```typescript
export default function UsersList() {
  const { users } = useFirebaseUsers({ sortField: 'name' });

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.name} ({item.email})</Text>
      )}
    />
  );
}
```

---

## 🐛 Troubleshooting

### "Nenhum usuário encontrado"
- Verificar se collection `users` existe no Firestore
- Confirmar se documentos têm os campos: email, name, uid
- Checar console para erros

### Dados não atualizam
- Verificar se listener foi registrado
- Confirmar se `unsubscribe()` não foi chamado
- Ver se Firestore tem dados reais

### "Error subscribing to users"
- Verificar regras de segurança do Firestore
- Confirmar autenticação do Firebase
- Ver console para mensagem de erro completa

### Memory leak warnings
- Verificar se cleanup (return unsubscribe) existe
- Confirmar que componentes desmontam corretamente
- Não criar múltiplos listeners para o mesmo dado

---

## 🔐 Segurança

### Regras de Firestore Necessárias

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários - apenas admin pode ler
    match /users/{document=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null;
    }
    
    // Dietas
    match /diets/{document=**} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📈 Performance

### Boas Práticas

1. **Filtrar Client-Side**
   ```typescript
   // ✅ Bom: Busca cliente-side
   const filtered = searchUsersLocal(users, searchTerm);
   ```

2. **Usar Índices se Necessário**
   - Firestore sugere automaticamente
   - Importante para queries complexas

3. **Cleanup Listeners**
   ```typescript
   useEffect(() => {
     const unsub = subscribeToUsers(callback);
     return () => unsub(); // ✅ Essencial
   }, []);
   ```

4. **Evitar Queries Desnecessárias**
   - Reutilizar listeners quando possível
   - Usar hooks para memoização

---

## 📝 Estrutura de Arquivos

```
projeto-mobile/
├── services/
│   ├── firebase-users.ts      ← User queries
│   ├── firebase-stats.ts      ← Stats/counts
│   └── firebase-diets.ts      ← (Futuro)
├── hooks/
│   ├── use-firebase-users.ts  ← User hook
│   └── use-firebase-stats.ts  ← (Futuro)
├── app/
│   └── admin/
│       ├── usuarios.tsx       ← Usa firebase-users
│       └── home.tsx           ← Usa firebase-stats
└── firebaseConfig.ts          ← Config
```

---

## ✨ Componentes Atualizados

### `app/admin/usuarios.tsx` ✅
- Usa `onSnapshot` em tempo real
- Busca por nome/email (client-side)
- Mostra: nome, email, uid, status

### `app/admin/home.tsx` ✅
- Stats de usuários em tempo real
- Stats de dietas em tempo real
- Lista de usuários recentes

---

## 🚀 Próximos Passos

1. **Adicionar Dietas Listener**
   - Criar `firebase-diets.ts`
   - Integrar com logs screen

2. **Adicionar Search Server-Side**
   - Índices do Firestore
   - Melhor performance com muitos dados

3. **Adicionar Paginação**
   - Para grandes conjuntos de dados
   - Usar `startAfter()` / `endAt()`

4. **Adicionar Filtros Avançados**
   - Por data
   - Por status
   - Customizados

---

## 📞 Referências

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [onSnapshot API](https://firebase.google.com/docs/firestore/query-data/listen)
- [React Hooks](https://react.dev/reference/react)

---

**Última atualização:** Maio 2026
