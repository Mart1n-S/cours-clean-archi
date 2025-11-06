describe('TUI runTui', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('sort proprement avec 0 et affiche Au revoir', async () => {
    const answers = ['0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({
        loadConfig: async () => ({ storeFile: 'ignored.json' })
      }))
      jest.doMock('../../app/container', () => ({
        buildContainer: () => fakeContainer
      }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(logs.some(l => l.includes('Au revoir'))).toBe(true)
    })
  })

  it('liste les produits et affiche le tableau', async () => {
    const answers = ['1', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn().mockResolvedValue([{ id: 'a', name: 'Alpha', stock: 2 }]) },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({
        loadConfig: async () => ({ storeFile: 'ignored.json' })
      }))
      jest.doMock('../../app/container', () => ({
        buildContainer: () => fakeContainer
      }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(fakeContainer.listStoredProducts.exec).toHaveBeenCalled()
      expect(logs.join('\n')).toContain('Alpha')
    })
  })

  it('ajoute un produit et affiche le succès', async () => {
    const answers = ['2', 'p1', 'Pen', '5', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({
        loadConfig: async () => ({ storeFile: 'ignored.json' })
      }))
      jest.doMock('../../app/container', () => ({
        buildContainer: () => fakeContainer
      }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(fakeContainer.addProduct.exec).toHaveBeenCalledWith({ id: 'p1', name: 'Pen', stock: 5 })
      expect(logs.join('\n')).toContain('ajouté')
    })
  })

  it('achète une quantité et affiche le nouveau stock', async () => {
    const answers = ['3', 'p1', '2', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn().mockResolvedValue({ id: 'p1', name: 'Pen', stock: 3 }) },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(fakeContainer.buyProduct.exec).toHaveBeenCalledWith('p1', 2)
      expect(logs.join('\n')).toContain('acheté, nouveau stock =')
    })
  })

  it('signale erreur invalid_qty lors de l\'achat', async () => {
    const answers = ['3', 'p1', '0', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn().mockRejectedValue(new Error('invalid_qty')) },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(fakeContainer.buyProduct.exec).toHaveBeenCalled()
      expect(logs.join('\n')).toContain('Erreur: invalid_qty')
    })
  })

  it('consulte produit: introuvable puis trouvé', async () => {
    const answers = ['4', 'abs', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'p2', name: 'Pen2', stock: 1 }) },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(fakeContainer.getProduct.exec).toHaveBeenCalledWith('abs')
      expect(logs.join('\n')).toContain('introuvable')
    })
  })

  it('recherche puis ajoute un produit trouvé', async () => {
    const answers = ['5', 'choco', '2', '1', '7', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn().mockResolvedValue([{ id: 'x1', name: 'ChocoBar', stock: 0 }, { id: 'x2', name: 'ChocoMilk', stock: 0 }]) }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(fakeContainer.searchProducts.exec).toHaveBeenCalledWith('choco', 2)
      expect(fakeContainer.addProduct.exec).toHaveBeenCalledWith({ id: 'x1', name: 'ChocoBar', stock: 7 })
      expect(logs.join('\n')).toContain('Résultats (2)')
    })
  })

  it('recherche puis annule via pick 0', async () => {
    const answers = ['5', 'x', '1', '0', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn().mockResolvedValue([{ id: 'x', name: 'X', stock: 0 }]) }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const mod = await import('./app')
      await mod.runTui()
      expect(fakeContainer.addProduct.exec).not.toHaveBeenCalled()
    })
  })

  it('affiche Choix invalide et gère saisie numérique invalide', async () => {
    const answers = ['9', '2', 'p3', 'Pencil', 'oops', '5', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn() },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(logs.join('\n')).toContain('Choix invalide')
      expect(logs.join('\n')).toContain('Veuillez entrer un nombre')
      expect(fakeContainer.addProduct.exec).toHaveBeenCalledWith({ id: 'p3', name: 'Pencil', stock: 5 })
    })
  })

  it('liste vide: affiche (aucun produit)', async () => {
    const answers = ['1', '0']
    const fakeContainer = {
      addProduct: { exec: jest.fn() },
      buyProduct: { exec: jest.fn() },
      getProduct: { exec: jest.fn() },
      listStoredProducts: { exec: jest.fn().mockResolvedValue([]) },
      searchProducts: { exec: jest.fn() }
    }

    jest.isolateModules(async () => {
      jest.doMock('readline', () => ({
        createInterface: () => ({
          question: (_q: string, cb: (a: string) => void) => cb(String(answers.shift() ?? '0')),
          close: () => {}
        })
      }))
      jest.doMock('../config/config', () => ({ loadConfig: async () => ({ storeFile: 'ignored.json' }) }))
      jest.doMock('../../app/container', () => ({ buildContainer: () => fakeContainer }))

      const logs: string[] = []
      const orig = console.log
      console.log = (...args: any[]) => { logs.push(args.join(' ')) }
      const mod = await import('./app')
      await mod.runTui()
      console.log = orig
      expect(logs.join('\n')).toContain('(aucun produit)')
    })
  })
})
