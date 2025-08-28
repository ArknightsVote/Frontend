/* eslint-disable ts/ban-ts-comment */
/* eslint-disable perfectionist/sort-imports */
// @ts-ignore
import palette from 'google-palette'
// @ts-ignore
import Geostats from 'geostats'

export function getColors(cluster_list: number[][]) {
  const color_list: string[] = []
  palette('rainbow', cluster_list.length, 0, 0.5, 0.95)
    .forEach((color: string, i: number) => {
      return color_list.push(...Array.from({ length: cluster_list[i].length }, () => color))
    })
  return color_list
}

function getClusterList(data_array: any, bound_list: any) {
  let i
  let j
  let k = 0
  let first
  let last

  const cluster_list = []
  if (bound_list[1] === data_array[1]) {
    k = 1
    cluster_list.push(data_array.slice(0, k))
  }
  for (i = 1, j = k; i < bound_list.length - 1; i++, j = k) {
    first = data_array.indexOf(bound_list[i], j)
    last = data_array.lastIndexOf(bound_list[i])
    if (bound_list[i] === bound_list[i + 1]) {
      k = first + 1
    }
    else {
      k = last + 1
    }
    cluster_list.push(data_array.slice(j, k))
  }
  cluster_list.push(data_array.slice(j))

  return cluster_list
}

function getSDCM(cluster_list: string | any[]) {
  const serie = new Geostats(cluster_list[0])
  let SDCM = serie.variance() // the Sum of squared Deviations about Class Mean

  for (let i = 1; i < cluster_list.length; i++) {
    serie.setSerie(cluster_list[i])
    SDCM += serie.variance()
  }
  return SDCM
}

export function getBestCluster(data_array: any) {
  const serie = new Geostats(data_array)
  const SDAM = serie.variance() // the Sum of squared Deviations from the Array Mean

  let cluster_list
  let nclasses = 1 // 聚类簇数
  let GVF // The Goodness of Variance Fit 方差拟合优度
  do {
    cluster_list = getClusterList(serie.serie, serie.getClassJenks2(++nclasses))
    GVF = 1 - getSDCM(cluster_list) / SDAM
  } while (GVF < 0.8)

  if (cluster_list.length === nclasses + 1) {
    cluster_list.splice(0, 2, cluster_list[0].concat(cluster_list[1]));
  }

  return {
    data: cluster_list,
    colors: getColors(cluster_list.reverse()),
    GVF,
    nclasses: nclasses,
  }
}

export function getNClassesCluster(clusterList: any, nclasses: number) {
  const serie = new Geostats(clusterList)
  const cluster_list = getClusterList(serie.serie, serie.getClassJenks2(nclasses))
  const GVF = 1 - getSDCM(cluster_list) / serie.variance()

  if (cluster_list.length === nclasses + 1) {
    cluster_list.splice(0, 2, cluster_list[0].concat(cluster_list[1]));
  }

  return {
    data: cluster_list,
    colors: getColors(cluster_list.reverse()),
    nclasses,
    GVF,
  }
}
